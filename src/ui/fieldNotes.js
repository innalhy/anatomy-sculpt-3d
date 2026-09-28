import { HOTSPOTS } from "../content/regions.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function noteParts(organ, spot) {
  const sys = el("p", "sys", `${organ.systemEn}  ·  ${organ.systemZh}`);
  const zh = el("h3", null, spot.zh);
  zh.lang = "zh-Hant";
  const en = el("p", "latin", spot.en);
  const rule = document.createElement("hr");
  rule.className = "rule";
  const fnEn = el("p", "fn", spot.fnEn);
  const fnZh = el("p", "fn zh", spot.fnZh);
  fnZh.lang = "zh-Hant";
  return [sys, zh, en, rule, fnEn, fnZh];
}

export function createFieldNotes({ cardBody, callout, markerLayer, state }) {
  function hideCallout() {
    callout.hidden = true;
    callout.replaceChildren();
  }

  function showPlaceholder(message) {
    state.openSpotId = null;
    cardBody.replaceChildren();
    cardBody.append(el("p", "placeholder", message));
    hideCallout();
    for (const button of markerLayer.querySelectorAll(".marker")) button.classList.remove("on");
  }

  function fillCard(organId, spotId) {
    const organ = HOTSPOTS[organId];
    const spot = organ.items[spotId];
    state.openSpotId = spotId;
    cardBody.replaceChildren(...noteParts(organ, spot));
    const parts = noteParts(organ, spot);
    const sys = el("p", "sys");
    sys.append(el("span", null, organ.systemEn), document.createElement("br"), el("span", "sys-zh", organ.systemZh));
    sys.lastChild.lang = "zh-Hant";
    const close = el("button", "close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close note");
    close.addEventListener("click", (event) => {
      event.stopPropagation();
      showPlaceholder("Markers are lit on this model. Choose one to read its name and function.");
    });
    const head = document.createElement("header");
    head.append(sys, close);
    callout.replaceChildren(head, ...parts.slice(1));
    callout.hidden = false;
    callout.style.visibility = "visible";
    for (const button of markerLayer.querySelectorAll(".marker")) {
      button.classList.toggle("on", button.dataset.spot === spotId);
    }
  }

  return { showPlaceholder, fillCard };
}
