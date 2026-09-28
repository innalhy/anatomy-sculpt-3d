const KEY = "anatomy-atelier-cards-v1";

export function loadRecord() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "");
    if (!raw || !Array.isArray(raw.answers)) return { answers: [] };
    return {
      answers: raw.answers.filter((row) => row && typeof row.id === "string" && typeof row.correct === "boolean"),
    };
  } catch {
    return { answers: [] };
  }
}

export function rememberAnswer(answer) {
  const record = loadRecord();
  record.answers.push({
    id: answer.id,
    region: answer.region,
    correct: answer.correct,
    at: Date.now(),
  });
  localStorage.setItem(KEY, JSON.stringify(record));
  return record;
}

export function clearRecord() {
  localStorage.removeItem(KEY);
}

export function summarize(record, questions) {
  const known = new Set(questions.map((question) => question.id));
  const answers = record.answers.filter((row) => known.has(row.id));
  const correct = answers.filter((row) => row.correct).length;
  let streak = 0;
  for (let i = answers.length - 1; i >= 0 && answers[i].correct; i -= 1) streak += 1;
  let best = 0;
  let run = 0;
  for (const row of answers) {
    run = row.correct ? run + 1 : 0;
    if (run > best) best = run;
  }

  const regions = [];
  for (const question of questions) {
    let bucket = regions.find((entry) => entry.region === question.region);
    if (!bucket) {
      bucket = { region: question.region, regionZh: question.regionZh, total: 0, correct: 0 };
      regions.push(bucket);
    }
  }
  for (const row of answers) {
    const question = questions.find((entry) => entry.id === row.id);
    const bucket = regions.find((entry) => entry.region === question?.region);
    if (!bucket) continue;
    bucket.total += 1;
    if (row.correct) bucket.correct += 1;
  }

  const structures = questions.map((question) => {
    const rows = answers.filter((row) => row.id === question.id);
    const last = rows[rows.length - 1];
    return {
      id: question.id,
      en: question.en,
      zh: question.zh,
      region: question.region,
      total: rows.length,
      correct: rows.filter((row) => row.correct).length,
      lastCorrect: last ? last.correct : null,
    };
  });

  const missed = questions.filter((question) => {
    const rows = answers.filter((row) => row.id === question.id);
    return rows.length > 0 && !rows[rows.length - 1].correct;
  });

  return {
    total: answers.length,
    correct,
    accuracy: answers.length ? correct / answers.length : 0,
    streak,
    best,
    regions,
    structures,
    missed,
    recent: answers.slice(-8).reverse(),
  };
}
