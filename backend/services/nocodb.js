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
        return response.data.list[0];
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
  async getUserCourses(userId, offset = 0, limit = 10) {
    try {
      // Сначала получаем покупки пользователя
      const purchasesResponse = await axios.get(
        `${this.baseURL}/${config.nocodb.tables.purchases}`,
        {
          headers: this.headers,
          params: {
            where: `(Покупатель,eq,${userId})~and(Оплата,eq,Да)`,
            offset: offset,
            limit: limit
          }
        }
      );

      const purchases = purchasesResponse.data.list || [];
      
      // Получаем информацию о курсах
      const coursesPromises = purchases.map(async (purchase) => {
        if (purchase['ID курса']) {
          try {
            const courseResponse = await axios.get(
              `${this.baseURL}/${config.nocodb.tables.courses}/${purchase['ID курса']}`,
              { headers: this.headers }
            );
            return {
              ...courseResponse.data,
              purchaseDate: purchase.Created
            };
          } catch (error) {
            console.error('Error fetching course:', error.message);
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
  async getUserPurchases(userId, offset = 0, limit = 10) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${config.nocodb.tables.purchases}`,
        {
          headers: this.headers,
          params: {
            where: `(Покупатель,eq,${userId})`,
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
      // Сначала получаем текущие бонусы
      const user = await this.getUserById(userId);
      const currentBonuses = user.Бонусы || 0;
      const newBonuses = currentBonuses + bonusAmount;

      const response = await axios.patch(
        `${this.baseURL}/${config.nocodb.tables.users}/${userId}`,
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
}

module.exports = new NocoDBService();
