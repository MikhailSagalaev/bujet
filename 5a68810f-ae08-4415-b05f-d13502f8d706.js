{
const TOOLS_RUNNER_URL = "https://functions.yandexcloud.net/d4esian9gs7m7m80qk1q";
const SHOWDOWN_URL = "https://storage.yandexcloud.net/collabza/showdown.min.js";
const TOOL_ID = "5a68810f-ae08-4415-b05f-d13502f8d706";
const BLOCK_ID = "#rec556083146";

$(document).ready(function () {
  const tool_id = TOOL_ID;
  const block_id = BLOCK_ID.substring(4);
  const block = $(BLOCK_ID).removeClass("r_hidden");

  block.wrap(`<div id="rec${block_id}" class="r"></div>`).remove();
  block.removeClass("r");
  const container = $(`#rec${block_id}`);

  const project_id = $("#allrecords").attr("data-tilda-project-id");
  const profile = JSON.parse(
    localStorage.getItem(`tilda_members_profile${project_id}`) ||
      localStorage.getItem("memberarea_profile") ||
      "{}"
  );
  profile["login"] = encodeURIComponent(profile["login"]);
  ["groups", "courses"].forEach((key) => delete profile[key]);
  const filters = new URLSearchParams(window.location.search).get(
    `filters${block_id}`
  );
  $.post(
    TOOLS_RUNNER_URL,
    JSON.stringify({
      tool_id: tool_id,
      profile: profile,
      project_id: project_id,
      referer: document.location.origin,
      user_agent: navigator.userAgent,
      filters: filters,
    }),
    function (data) {
      data.records?.forEach(function (record, index) {
        item = block.clone(true).attr("id", `rec${block_id}_${index}`);
        if ("html" in record) {
          item.find(".t123 > div > div").html(record.html);
        }
        item.appendTo(container);
        $(window).trigger("resize");
        window.dispatchEvent(new Event("resize"));
      });
      container.trigger("collabza_loaded");
    }
  ).fail(function (data) {
    container.text(
      `Collabza error (${BLOCK_ID}): ${data?.responseJSON?.message}`
    );
    container.css("text-align", "center");
  });
});
}
