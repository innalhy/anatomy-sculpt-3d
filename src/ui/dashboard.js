import { QUESTIONS, questionById } from "../content/questions.js";
import { clearRecord, loadRecord, summarize } from "../stats/record.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

function donut(accuracy, total) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 120 120");
  svg.setAttribute("class", "donut");
  const track = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  track.setAttribute("cx", "60");
  track.setAttribute("cy", "60");
  track.setAttribute("r", "46");
  track.setAttribute("class", "donut-track");
  const arc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  arc.setAttribute("cx", "60");
  arc.setAttribute("cy", "60");
  arc.setAttribute("r", "46");
  arc.setAttribute("class", "donut-arc");
  const length = 2 * Math.PI * 46;
  arc.style.strokeDasharray = `${total ? accuracy * length : 0} ${length}`;
  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", "60");
  label.setAttribute("y", "66");
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("class", "donut-label");
  label.textContent = total ? percent(accuracy) : "—";
  svg.append(track, arc, label);
  return svg;
}

export function createDashboard({ root, onStart, onMissed }) {
  let armedClear = false;

  function render() {
    armedClear = false;
    const stats = summarize(loadRecord(), QUESTIONS);
    root.replaceChildren();

    const head = el("header", "dash-head");
    const titles = el("div");
    titles.append(el("p", "eyebrow", "Progress"), el("h2", null, "How the cards are going"));
    const zh = el("p", "dash-zh", "答題紀錄會留在這台瀏覽器裡。");
    zh.lang = "zh-Hant";
    titles.append(zh);
    head.append(titles, donut(stats.accuracy, stats.total));

    const tiles = el("div", "stat-grid");
    for (const [value, label] of [
      [String(stats.total), "Answered"],
      [String(stats.correct), "Correct"],
      [stats.total ? percent(stats.accuracy) : "—", "Accuracy"],
      [String(stats.streak), "Streak"],
    ]) {
      const tile = el("article", "stat");
      tile.append(el("b", null, value), el("span", null, label));
      tiles.append(tile);
    }

    const regionBlock = el("section", "dash-block");
    regionBlock.append(el("h3", null, "By topic"));
    if (!stats.total) {
      const empty = el("p", "placeholder", "Answer a card and the topics will fill in here.");
      regionBlock.append(empty);
    } else {
      for (const region of stats.regions) {
        const row = el("div", "bar-row");
        const meta = el("div", "bar-meta");
        const name = el("span", "bar-name", region.region);
        const nameZh = el("span", "bar-zh", region.regionZh);
        nameZh.lang = "zh-Hant";
        const fraction = region.total ? `${region.correct}/${region.total}` : "—";
        meta.append(name, nameZh, el("span", "bar-frac", fraction));
        const track = el("div", "bar-track");
        const fill = el("div", "bar-fill");
        fill.style.width = region.total ? percent(region.correct / region.total) : "0%";
        track.append(fill);
        row.append(meta, track);
        regionBlock.append(row);
      }
    }

    const recentBlock = el("section", "dash-block");
    recentBlock.append(el("h3", null, "Recent answers"));
    if (!stats.recent.length) {
      recentBlock.append(el("p", "placeholder", "Nothing recorded yet."));
    } else {
      const list = el("ol", "recent");
      for (const row of stats.recent) {
        const question = questionById(row.id);
        const item = el("li", row.correct ? "ok" : "miss");
        const mark = el("span", "mark", row.correct ? "Correct" : "Missed");
        const name = el("span", "recent-zh", question ? question.zh : row.id);
        name.lang = "zh-Hant";
        item.append(mark, name, el("span", "recent-en", question ? question.en : ""));
        list.append(item);
      }
      recentBlock.append(list);
    }

    const tableBlock = el("section", "dash-block");
    tableBlock.append(el("h3", null, "Each structure"));
    const table = el("div", "struct-table");
    for (const structure of stats.structures) {
      const row = el("div", "struct-row");
      if (structure.lastCorrect === true) row.classList.add("ok");
      if (structure.lastCorrect === false) row.classList.add("miss");
      const names = el("div");
      const zh = el("span", "struct-zh", structure.zh);
      zh.lang = "zh-Hant";
      names.append(zh, el("span", "struct-en", structure.en));
      const tally = structure.total
        ? `${structure.correct}/${structure.total}`
        : "Not tried";
      row.append(names, el("span", "struct-region", structure.region), el("span", "struct-tally", tally));
      table.append(row);
    }
    tableBlock.append(table);

    const actions = el("div", "dash-actions");
    const start = el("button", "next-card", "Revise by topic");
    start.type = "button";
    start.addEventListener("click", onStart);
    actions.append(start);
    if (stats.missed.length) {
      const missed = el("button", "next-card ghost", `Practice ${stats.missed.length} still missed`);
      missed.type = "button";
      missed.addEventListener("click", () => onMissed(stats.missed));
      actions.append(missed);
    }
    const clear = el("button", "text-button", "Clear the record");
    clear.type = "button";
    clear.addEventListener("click", () => {
      if (!armedClear) {
        armedClear = true;
        clear.textContent = "Clear everything?";
        return;
      }
      clearRecord();
      render();
    });
    actions.append(clear);

    const foot = el("p", "dash-foot", `Best streak ${stats.best}. Rounds follow the model topics: bones light on the skeleton, and muscles, nerves, and vessels open the official model.`);
    root.append(head, tiles, regionBlock, recentBlock, tableBlock, actions, foot);
  }

  return { render };
}
