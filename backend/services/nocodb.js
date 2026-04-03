const axios = require('axios');
const config = require('../config');

class NocoDBService {
  constructor() {
    this.baseURL = `${config.nocodb.url}/api/v1/db/data/v1/${config.nocodb.projectId}`;
    this.headers = {
      'xc-token': config.nocodb.token,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Получить пользователя по Email
   */
  async getUserByEmail(email) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${config.nocodb.tables.users}`,
        {
          headers: this.headers,
          params: {
            where: `(Email,eq,${email})`
          }
        }
      );

      if (response.data.list && response.data.list.length > 0) {
        const user = response.data.list[0];
        // NocoDB возвращает Id с большой буквы, нормализуем
        return {
          ...user,
          ID: user.Id || user.ID
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error.message);
      throw error;
    }
  }

  /**
   * Получить пользователя по ID
   */
  async getUserById(userId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${config.nocodb.tables.users}/${userId}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting user by ID:', error.message);
      throw error;
    }
  }

  /**
   * Получить курсы пользователя
   */
  async getUserCourses(userEmail, offset = 0, limit = 10) {
    try {
      console.log('Getting courses for email:', userEmail);
      
      // Ищем покупки по Email напрямую
      const purchasesResponse = await axios.get(
        `${this.baseURL}/${config.nocodb.tables.purchases}`,
        {
          headers: this.headers,
          params: {
            where: `(Email,eq,${userEmail})`,
            offset: offset,
            limit: limit
          }
        }
      );

      const purchases = purchasesResponse.data.list || [];
      
      // Получаем информацию о курсах через Courses_id
      const coursesPromises = purchases.map(async (purchase) => {
        const courseId = purchase['Courses_id'] || purchase['ID курса'];
        if (courseId) {
          try {
            const courseResponse = await axios.get(
              `${this.baseURL}/${config.nocodb.tables.courses}/${courseId}`,
              { headers: this.headers }
            );
            return {
              ...courseResponse.data,
              purchaseDate: purchase.CreatedAt || purchase.Created
            };
          } catch (error) {
            console.error('Error fetching course:', courseId, error.message);
            return null;
          }
        }
        return null;
      });

      const courses = await Promise.all(coursesPromises);
      
      return {
        courses: courses.filter(c => c !== null),
        total: purchasesResponse.data.pageInfo?.totalRows || courses.length,
        hasMore: purchasesResponse.data.pageInfo?.isLastPage === false
      };
    } catch (error) {
      console.error('Error getting user courses:', error.message);
      throw error;
    }
  }

  /**
   * Получить покупки пользователя
   */
  async getUserPurchases(userEmail, offset = 0, limit = 10) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${config.nocodb.tables.purchases}`,
        {
          headers: this.headers,
          params: {
            where: `(Email,eq,${userEmail})`,
            offset: offset,
            limit: limit,
            sort: '-Created'
          }
        }
      );

      return {
        purchases: response.data.list || [],
        total: response.data.pageInfo?.totalRows || 0,
        hasMore: response.data.pageInfo?.isLastPage === false
      };
    } catch (error) {
      console.error('Error getting user purchases:', error.message);
      throw error;
    }
  }

  /**
   * Получить рефералов пользователя
   */
  async getUserReferrals(userId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${config.nocodb.tables.users}`,
        {
          headers: this.headers,
          params: {
            where: `(Кто привёл,eq,${userId})`
          }
        }
      );

      const referrals = response.data.list || [];
      
      // Подсчитываем сколько оплатили
      const paidReferrals = referrals.filter(ref => 
        ref['Оплатили подписку'] && ref['Оплатили подписку'] > 0
      );

      return {
        referrals: referrals,
        count: referrals.length,
        paidCount: paidReferrals.length
      };
    } catch (error) {
      console.error('Error getting user referrals:', error.message);
      throw error;
    }
  }

  /**
   * Создать покупку
   */
  async createPurchase(purchaseData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${config.nocodb.tables.purchases}`,
        purchaseData,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating purchase:', error.message);
      throw error;
    }
  }

  /**
   * Обновить бонусы пользователя
   */
  async updateUserBonuses(userId, bonusAmount) {
    try {
      if (!userId) {
        console.error('updateUserBonuses: userId is empty, skipping');
        return;
      }
      const numericId = parseInt(userId);
      if (!numericId) {
        console.error('updateUserBonuses: userId is not numeric:', userId);
        return;
      }
      const user = await this.getUserById(numericId);
      const currentBonuses = user.Бонусы || 0;
      const newBonuses = currentBonuses + bonusAmount;

      console.log(`Updating bonuses for user ${numericId}: ${currentBonuses} + ${bonusAmount} = ${newBonuses}`);

      const response = await axios.patch(
        `${this.baseURL}/${config.nocodb.tables.users}/${numericId}`,
        { Бонусы: newBonuses },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user bonuses:', error.message);
      throw error;
    }
  }

  /**
   * Обновить счётчик рефералов
   */
  async updateReferralCount(userId) {
    try {
      const referralsData = await this.getUserReferrals(userId);
      
      await axios.patch(
        `${this.baseURL}/${config.nocodb.tables.users}/${userId}`,
        {
          'Количество рефералов': referralsData.count,
          'Оплатили подписку': referralsData.paidCount
        },
        { headers: this.headers }
      );
    } catch (error) {
      console.error('Error updating referral count:', error.message);
      throw error;
    }
  }

  /**
   * Обновить произвольные поля пользователя
   */
  async updateUser(userId, fields) {
    try {
      const response = await axios.patch(
        `${this.baseURL}/${config.nocodb.tables.users}/${userId}`,
        fields,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw error;
    }
  }

  /**
   * Создать пользователя
   */
  async createUser(userData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${config.nocodb.tables.users}`,
        userData,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }

  /**
   * Создать запись в любой таблице
   */
  async createRecord(tableName, recordData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${tableName}`,
        recordData,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error.message);
      throw error;
    }
  }
}

module.exports = new NocoDBService();
