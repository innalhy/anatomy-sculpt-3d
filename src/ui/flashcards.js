import { QUESTIONS, TOPICS, mixedRound, questionsForTopic } from "../content/questions.js";
import { rememberAnswer } from "../stats/record.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createFlashcards({ cardBody, kicker, sessionEl, present, onAnswered }) {
  let deck = null;

  function current() {
    if (!deck || deck.phase === "done" || deck.phase === "topics") return null;
    return deck.items[deck.index];
  }

  function showCurrent() {
    const question = current();
    if (!question) return;
    present(question);
    if (!deck.choices) {
      deck.choices = shuffle(question.choices.map(([en, zh]) => ({ en, zh })));
    }
    renderCard();
    renderSession();
  }

  function start(list, meta = {}) {
    deck = {
      items: shuffle(list),
      source: list.slice(),
      topicEn: meta.en || "Revision",
      topicZh: meta.zh || "複習",
      index: 0,
      phase: list.length ? "ask" : "done",
      choices: null,
      pick: null,
      results: [],
    };
    if (deck.phase === "done") renderSummary();
    else showCurrent();
  }

  function showTopics() {
    deck = { phase: "topics" };
    present(null);
    kicker.textContent = "Revision";
    cardBody.replaceChildren();
    const title = el("h3", "card-prompt", "Revise by topic");
    const zh = el("p", "fn zh", "先選一個主題。骨骼題會亮起那塊骨；肌肉、神經與血管題會打開官方模型。");
    zh.lang = "zh-Hant";
    const note = el("p", "fn", "A mixed round draws across every topic. A topic round stays inside that region.");
    cardBody.append(title, zh, note);

    sessionEl.replaceChildren();
    sessionEl.append(el("p", "session-kicker", "Topics"));
    const zhTitle = el("p", "session-zh", "按主題複習");
    zhTitle.lang = "zh-Hant";
    const list = el("div", "topics");
    const mixed = topicButton("Mixed round", "綜合一輪", `${Math.min(12, QUESTIONS.length)} cards`, () => {
      start(mixedRound(12), { en: "Mixed round", zh: "綜合一輪" });
    });
    list.append(mixed);
    for (const topic of TOPICS) {
      const count = questionsForTopic(topic.id).length;
      list.append(topicButton(topic.en, topic.zh, `${count} cards`, () => {
        start(questionsForTopic(topic.id), topic);
      }));
    }
    sessionEl.append(zhTitle, list);
  }

  function topicButton(en, zh, count, onClick) {
    const button = el("button", "topic");
    button.type = "button";
    const name = el("span", "topic-en", en);
    const nameZh = el("span", "topic-zh", zh);
    nameZh.lang = "zh-Hant";
    button.append(name, nameZh, el("span", "topic-count", count));
    button.addEventListener("click", onClick);
    return button;
  }

  function enter() {
    if (!deck || deck.phase === "topics") showTopics();
    else if (deck.phase === "done") renderSummary();
    else showCurrent();
  }

  function answer(choice) {
    const question = current();
    if (!question || deck.phase !== "ask") return;
    const correct = choice.en === question.en;
    deck.phase = "reveal";
    deck.pick = choice;
    deck.results.push(correct);
    rememberAnswer({ id: question.id, region: question.region, correct });
    onAnswered();
    renderCard();
    renderSession();
  }

  function next() {
    if (!deck || deck.phase !== "reveal") return;
    deck.index += 1;
    deck.choices = null;
    deck.pick = null;
    deck.phase = deck.index >= deck.items.length ? "done" : "ask";
    if (deck.phase === "done") {
      present(null);
      renderSummary();
      return;
    }
    showCurrent();
  }

  function renderSession() {
    sessionEl.replaceChildren();
    const title = el("p", "session-kicker", deck?.topicEn || "Revision");
    if (!deck || deck.phase === "topics") {
      showTopics();
      return;
    }
    if (deck.phase === "done") {
      const score = deck.results.filter(Boolean).length;
      const pips = el("ol", "pips");
      for (const ok of deck.results) pips.append(el("li", ok ? "ok" : "miss"));
      const zh = el("p", "session-zh", deck.topicZh);
      zh.lang = "zh-Hant";
      sessionEl.append(
        title,
        zh,
        el("p", "session-count", `${score}  /  ${deck.results.length}`),
        el("p", "session-note", "Round complete. Shuffle this topic again, or choose another."),
        pips,
      );
      return;
    }
    const count = el("p", "session-count", `${deck.index + 1}  /  ${deck.items.length}`);
    const zh = el("p", "session-zh", deck.topicZh);
    zh.lang = "zh-Hant";
    const question = current();
    const note = el("p", "session-note", question?.model
      ? "The official model is in the frame. Turn it, then choose."
      : "Turn the model if you want another side. The name stays hidden until you choose.");
    const pips = el("ol", "pips");
    deck.items.forEach((_, index) => {
      const pip = el("li");
      if (index < deck.results.length) pip.className = deck.results[index] ? "ok" : "miss";
      else if (index === deck.index) pip.className = "now";
      pips.append(pip);
    });
    const score = deck.results.filter(Boolean).length;
    const back = el("button", "text-button topic-back", "All topics");
    back.type = "button";
    back.addEventListener("click", showTopics);
    sessionEl.append(title, zh, count, note, pips, el("p", "session-note", `${score} correct so far`), back);
  }

  function renderCard() {
    const question = current();
    kicker.textContent = "Flashcard";
    cardBody.replaceChildren();
    const region = el("p", "sys", `${question.region}  ·  ${question.regionZh}`);
    const prompt = el("h3", "card-prompt", question.promptEn);
    const promptZh = el("p", "fn zh", question.promptZh);
    promptZh.lang = "zh-Hant";
    const list = el("div", "choices");
    for (const choice of deck.choices) {
      const button = el("button", "choice");
      button.type = "button";
      const zh = el("span", "choice-zh", choice.zh);
      zh.lang = "zh-Hant";
      button.append(zh, el("span", "choice-en", choice.en));
      if (deck.phase === "reveal") {
        button.disabled = true;
        if (choice.en === question.en) button.classList.add("right");
        else if (deck.pick && choice.en === deck.pick.en) button.classList.add("wrong");
      } else {
        button.addEventListener("click", () => answer(choice));
      }
      list.append(button);
    }
    cardBody.append(region, prompt, promptZh, list);
    if (deck.phase !== "reveal") return;
    const correct = deck.pick.en === question.en;
    const verdict = el("p", correct ? "verdict ok" : "verdict miss", correct ? "Correct" : "Look again");
    const name = el("p", "reveal-name", question.zh);
    name.lang = "zh-Hant";
    const latin = el("p", "latin", question.en);
    const explain = el("p", "fn", question.explainEn);
    const explainZh = el("p", "fn zh", question.explainZh);
    explainZh.lang = "zh-Hant";
    const nextButton = el("button", "next-card", deck.index + 1 >= deck.items.length ? "See the round" : "Next card");
    nextButton.type = "button";
    nextButton.addEventListener("click", next);
    cardBody.append(verdict, name, latin, explain, explainZh, nextButton);
  }

  function renderSummary() {
    kicker.textContent = "Flashcard";
    const results = deck ? deck.results : [];
    const score = results.filter(Boolean).length;
    cardBody.replaceChildren();
    renderSession();
    const prompt = el("h3", "card-prompt", results.length ? `${score} of ${results.length}` : deck?.topicEn || "Revision");
    const promptZh = el("p", "fn zh", results.length ? `${deck.topicZh}，這一輪的結果。` : "先選一個主題。");
    promptZh.lang = "zh-Hant";
    const again = el("button", "next-card", "Shuffle this topic");
    again.type = "button";
    again.addEventListener("click", () => start(deck.source, { en: deck.topicEn, zh: deck.topicZh }));
    const topics = el("button", "next-card ghost", "Choose another topic");
    topics.type = "button";
    topics.addEventListener("click", showTopics);
    cardBody.append(prompt, promptZh, again, topics);
    const missedQuestions = deck?.items
      ? deck.items.filter((_, index) => deck.results[index] === false)
      : [];
    if (missedQuestions.length) {
      const practice = el("button", "next-card ghost", `Practice the ${missedQuestions.length} missed`);
      practice.type = "button";
      practice.addEventListener("click", () => start(missedQuestions, { en: "Missed", zh: "未掌握" }));
      cardBody.append(practice);
    }
  }

  function onKey(event) {
    if (sessionEl.hidden || !deck || deck.phase === "topics") return;
    if (deck.phase === "ask" && event.key >= "1" && event.key <= "4") {
      const choice = deck.choices?.[Number(event.key) - 1];
      if (choice) answer(choice);
    } else if (deck.phase === "reveal" && event.key === "Enter") {
      next();
    }
  }

  window.addEventListener("keydown", onKey);

  return { enter, start, showTopics };
}
