{
const TOOLS_RUNNER_URL = "https://functions.yandexcloud.net/d4esian9gs7m7m80qk1q";
const SHOWDOWN_URL = "https://storage.yandexcloud.net/collabza/showdown.min.js";
const TOOL_ID = "e7509dde-3bfa-44dc-b455-2465e75e6614";
const BLOCK_ID = "#rec543510144";

function translateLoadMore(lang) {
  const translations = {
    EN: "Load more",
    RU: "Загрузить ещё",
    FR: "Charger plus",
    DE: "Mehr laden",
    ES: "Carga más",
    PT: "Carregue mais",
    UK: "Завантажити ще",
    JA: "もっと読み込む",
    ZH: "裝載更多",
  };
  if (lang && translations[lang]) {
    return translations[lang];
  } else {
    return translations.EN;
  }
}

$(document).ready(function () {
  const block_id = BLOCK_ID.substring(4);
  const block_template = $(BLOCK_ID).removeClass("r_hidden");
  block_template.find("script").remove();

  block_template
    .wrap(`<div id="collabza_rec${block_id}" class="r"></div>`)
    .remove();
  block_template.removeClass("r");
  const collabza_wrapper = $(`#collabza_rec${block_id}`);

  block_template
    .find(".t431__table-wrapper")
    .append(
      $(
        '<div class="t431__btnwrapper collabza_loadmore" style="width:100%; text-align:center; margin-top:40px"><a class="t-btn t-btn_sm"><table style="width:100%; height:100%"><tbody><tr><td></td></tr></tbody></table></a></div>'
      )
    );

  const project_id = $("#allrecords").attr("data-tilda-project-id");
  const profile = JSON.parse(
    localStorage.getItem(`tilda_members_profile${project_id}`) ||
      localStorage.getItem("memberarea_profile") ||
      "{}"
  );
  profile["login"] = encodeURIComponent(profile["login"]);
  ["groups", "courses"].forEach((key) => delete profile[key]);

  let block;
  let load_more;
  let filters;

  function loadMore(event) {
    load_more.off("click");
    load_more.find("td").text("...");

    $.post(
      TOOLS_RUNNER_URL,
      JSON.stringify({
        tool_id: TOOL_ID,
        profile: profile,
        project_id: project_id,
        referer: document.location.origin,
        user_agent: navigator.userAgent,
        filters: filters,
        offset: event.data.offset,
      }),
      function (data) {
        let text = "";
        data.records?.forEach((record) => {
          if ("table_content" in record) {
            text += record.table_content + "\n";
          }
        });
        block.find(".t431__data-part2").text(text);
        if (event.data.offset) {
          block.find(".t431__data-part1").text("");
        } else {
          block.find(".t431__table").empty();
        }
        t431_init(block_id);

        if (data.offset) {
          load_more.find("td").text(translateLoadMore(window.tildaBrowserLang));
          load_more.click({ offset: data.offset }, loadMore);
        } else {
          load_more.remove();
        }
        $(window).trigger("resize");
        window.dispatchEvent(new Event("resize"));
        block.trigger("collabza_loaded");
      }
    ).fail(function (data) {
      block.text(
        `Collabza error (${BLOCK_ID}): ${data?.responseJSON?.message}`
      );
      block.css("text-align", "center").show();
    });
  }

  collabza_wrapper.on("collabza_init", function () {
    block = block_template.clone();
    collabza_wrapper.empty();
    collabza_wrapper.append(block);
    block.find(".t431__table").empty();
    load_more = block.find(".collabza_loadmore");
    filters = new URLSearchParams(window.location.search).get(
      `filters${block_id}`
    );
    loadMore({ data: { offset: null } });
  });
  collabza_wrapper.trigger("collabza_init");
});
}
