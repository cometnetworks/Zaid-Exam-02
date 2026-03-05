/* =========================================================
   Zaíd Smart Test — app.js (FIX + UX)
   - FIX: Generated questions no longer have "multiple correct" distractors
   - Shows per-question origin: Banco / Generada
========================================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  // Screens
  const screens = {
    home: $("screen-home"),
    quiz: $("screen-quiz"),
    results: $("screen-results"),
  };

  // Top toggle
  const parentsToggleBtn = $("parentsToggleBtn");
  const pillParents = $("pillParents");
  const resultsParentsPill = $("resultsParentsPill");

  // Setup controls
  const gradePhase = $("gradePhase");
  const questionSource = $("questionSource");
  const questionCount = $("questionCount");
  const sessionMode = $("sessionMode");
  const difficulty = $("difficulty");
  const shuffleSel = $("shuffle");
  const startMixedBtn = $("startMixedBtn");

  // Nav buttons
  const homeBtn1 = $("homeBtn1");
  const homeBtn2 = $("homeBtn2");

  // Quiz UI
  const pillProgress = $("pillProgress");
  const pillSubject = $("pillSubject");
  const pillSource = $("pillSource");     // session source (Banco/Generadas/Mixto)
  const pillOrigin = $("pillOrigin");     // NEW: current question origin (Banco/Generada)
  const topicLine = $("topicLine");
  const promptEl = $("prompt");
  const optionsEl = $("options");
  const feedbackEl = $("feedback");
  const nextBtn = $("nextBtn");
  const revealBtn = $("revealBtn");
  const hintLine = $("hintLine");

  // Results UI
  const scoreLine = $("scoreLine");
  const reviewEl = $("review");
  const retryBtn = $("retryBtn");
  const newBtn = $("newBtn");

  /* -------------------------
     BANK (Fase 1)
  -------------------------- */
  const BANK = [
    { id:"esp-1", phase:"P1-F1", subject:"Español", topic:"Cuento", prompt:"¿Cuáles son las partes de un cuento?", options:["Inicio, desarrollo y final","Verso, estrofa y rima","Regla, instrucción y tablero"], answerIndex:0, explanation:"Un cuento tiene inicio, desarrollo y final." },
    { id:"esp-2", phase:"P1-F1", subject:"Español", topic:"Cuento", prompt:"¿Qué es un personaje principal?", options:["El más importante de la historia","Un lugar","Una regla"], answerIndex:0, explanation:"El personaje principal es el más importante." },
    { id:"esp-3", phase:"P1-F1", subject:"Español", topic:"Carta", prompt:"¿Qué va al inicio de una carta?", options:["Lugar y fecha","Firma","Despedida"], answerIndex:0, explanation:"Al inicio va lugar y fecha." },
    { id:"esp-4", phase:"P1-F1", subject:"Español", topic:"Puntuación", prompt:"¿Qué signo son los dos puntos?", options:[":",".","¿ ?"], answerIndex:0, explanation:"Los dos puntos se escriben así: : " },
    { id:"esp-5", phase:"P1-F1", subject:"Español", topic:"Puntuación", prompt:"¿Para qué sirven los dos puntos (:)?", options:["Para presentar una lista o explicación","Para hacer una pregunta","Para gritar"], answerIndex:0, explanation:"Sirven para presentar una lista o explicación." },

    { id:"mat-1", phase:"P1-F1", subject:"Matemáticas", topic:"Unidades y decenas", prompt:"En el número 37, ¿cuántas decenas hay?", options:["3","7","37"], answerIndex:0, explanation:"37 = 3 decenas y 7 unidades." },
    { id:"mat-2", phase:"P1-F1", subject:"Matemáticas", topic:"Figuras", prompt:"¿Cuál figura es redonda?", options:["Círculo","Rombo","Paralelogramo"], answerIndex:0, explanation:"El círculo es redondo." },
    { id:"mat-3", phase:"P1-F1", subject:"Matemáticas", topic:"Días", prompt:"¿Qué día va después del lunes?", options:["Domingo","Martes","Sábado"], answerIndex:1, explanation:"Después del lunes va martes." },

    { id:"ing-1", phase:"P1-F1", subject:"Inglés", topic:"Colors", prompt:"¿Cómo se dice 'rojo' en inglés?", options:["Red","Blue","Green"], answerIndex:0, explanation:"Rojo = Red." },
    { id:"ing-2", phase:"P1-F1", subject:"Inglés", topic:"Family", prompt:"¿Cómo se dice 'mamá' en inglés?", options:["Dad","Mom","Grandma"], answerIndex:1, explanation:"Mamá = Mom." },
    { id:"ing-3", phase:"P1-F1", subject:"Inglés", topic:"There is/are", prompt:"Para hablar de MUCHAS cosas usamos…", options:["There is","There are","This is"], answerIndex:1, explanation:"Plural = There are." },

    { id:"eti-1", phase:"P1-F1", subject:"Ética", topic:"Biótico/Abiótico", prompt:"¿Cuál es un factor biótico?", options:["Una planta","Una roca","El aire"], answerIndex:0, explanation:"Biótico = ser vivo." },
    { id:"eti-2", phase:"P1-F1", subject:"Ética", topic:"Empujar y jalar", prompt:"Jalar significa…", options:["Traer algo hacia ti","Alejar algo de ti","Rodar"], answerIndex:0, explanation:"Jalar = traer hacia ti." },
  ].map(q => ({...q, origin:"bank"}));

  /* -------------------------
     Generator data
  -------------------------- */
  const GEN = {
    colors_es_en: [
      { es:"rojo", en:"red" },
      { es:"azul", en:"blue" },
      { es:"verde", en:"green" },
      { es:"amarillo", en:"yellow" },
      { es:"negro", en:"black" },
      { es:"blanco", en:"white" },
      { es:"naranja", en:"orange" },
      { es:"morado", en:"purple" },
      { es:"gris", en:"gray" },
      { es:"rosa", en:"pink" },
      { es:"café", en:"brown" },
    ],
    family_es_en: [
      { es:"mamá", en:"mom" },
      { es:"papá", en:"dad" },
      { es:"hermano", en:"brother" },
      { es:"hermana", en:"sister" },
      { es:"abuela", en:"grandma" },
      { es:"abuelo", en:"grandpa" },
    ],
    snacks: ["sandwich","banana","carrot","donut","cupcake","cookie","hamburger","pear","pineapple","hot dog"],
  };

  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function choice(arr){ return arr[randInt(0, arr.length-1)]; }
  function shuffle(arr){
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function uniq(arr){ return Array.from(new Set(arr)); }

  function makeMCQ({id, subject, topic, prompt, correct, distractors, explanation="", phase="P1-F1"}) {
    let options = uniq([correct, ...distractors]);
    while (options.length < 3) options.push("Ninguna de las anteriores");
    options = options.slice(0, 4);
    options = shuffle(options);
    const answerIndex = options.indexOf(correct);
    return { id, subject, topic, prompt, options, answerIndex, explanation, phase, origin:"generated" };
  }

  /* -------------------------
     FIXED Generators (no multiple-correct distractors)
  -------------------------- */
  function genEnglishColorTranslate(phase){
    // Question type: "¿Cómo se dice X en inglés?" (single correct)
    const item = choice(GEN.colors_es_en);
    const correct = item.en;

    // Distractors: other EN colors (ok) because only one matches the asked ES word.
    const otherColors = GEN.colors_es_en.map(x => x.en).filter(x => x !== correct);
    const distractors = shuffle(otherColors).slice(0,2);

    return makeMCQ({
      id:`gen-ing-color-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Inglés",
      topic:"Colors",
      prompt:`¿Cómo se dice "${item.es}" en inglés?`,
      correct,
      distractors,
      explanation:`"${item.es}" en inglés es "${correct}".`,
      phase
    });
  }

  function genEnglishFamilyTranslate(phase){
    const item = choice(GEN.family_es_en);
    const correct = item.en;

    const other = GEN.family_es_en.map(x => x.en).filter(x => x !== correct);
    const distractors = shuffle(other).slice(0,2);

    return makeMCQ({
      id:`gen-ing-family-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Inglés",
      topic:"My Family",
      prompt:`¿Cómo se dice "${item.es}" en inglés?`,
      correct,
      distractors,
      explanation:`"${item.es}" en inglés es "${correct}".`,
      phase
    });
  }

  function genThereIsAre(phase){
    const plural = Math.random() < 0.5;
    return makeMCQ({
      id:`gen-ing-there-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Inglés",
      topic:"There is / There are",
      prompt: plural ? "Para hablar de MUCHAS cosas usamos…" : "Para UNA cosa usamos…",
      correct: plural ? "There are" : "There is",
      distractors: plural ? ["There is","This is"] : ["There are","This is"],
      explanation: plural ? "Plural = There are." : "Singular = There is.",
      phase
    });
  }

  // Simple generators for other subjects (kept small, you can expand)
  function genSpanishPunctuation(phase){
    const types = [
      { prompt:"¿Qué signo son los dos puntos?", correct:":", distractors:[".","¿ ?"], explanation:"Dos puntos = :" },
      { prompt:"¿Para qué sirven los dos puntos (:)?", correct:"Para presentar una lista o explicación", distractors:["Para hacer una pregunta","Para gritar"], explanation:"Sirven para presentar una lista o explicación." },
    ];
    const pick = choice(types);
    return makeMCQ({
      id:`gen-esp-punc-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Español",
      topic:"Puntuación",
      prompt: pick.prompt,
      correct: pick.correct,
      distractors: pick.distractors,
      explanation: pick.explanation,
      phase
    });
  }

  function genMathUnitsTens(phase){
    const n = randInt(10, 99);
    const tens = Math.floor(n/10);
    const ones = n%10;
    const askTens = Math.random() < 0.5;
    const correct = askTens ? String(tens) : String(ones);
    const distractors = shuffle([String(ones), String(tens), String(n), String(randInt(0,9))].filter(x=>x!==correct)).slice(0,2);

    return makeMCQ({
      id:`gen-mat-ud-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Matemáticas",
      topic:"Unidades y decenas",
      prompt: askTens ? `En el número ${n}, ¿cuántas decenas hay?` : `En el número ${n}, ¿cuántas unidades hay?`,
      correct,
      distractors,
      explanation: `${n} = ${tens} decenas y ${ones} unidades.`,
      phase
    });
  }

  function genBioticAbiotic(phase){
    const askBiotic = Math.random() < 0.5;
    const biotic = ["planta","perro","gato","árbol"];
    const abiotic = ["agua","aire","roca","luz del sol"];
    const correct = askBiotic ? choice(biotic) : choice(abiotic);
    const distractors = askBiotic ? shuffle(abiotic).slice(0,2) : shuffle(biotic).slice(0,2);

    return makeMCQ({
      id:`gen-eti-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Ética",
      topic:"Biótico/Abiótico",
      prompt: askBiotic ? "¿Cuál es un factor biótico?" : "¿Cuál es un factor abiótico?",
      correct,
      distractors,
      explanation: askBiotic ? "Biótico = ser vivo." : "Abiótico = no vivo.",
      phase
    });
  }

  const GENERATORS = {
    "Español": [genSpanishPunctuation],
    "Matemáticas": [genMathUnitsTens],
    "Inglés": [genEnglishColorTranslate, genEnglishFamilyTranslate, genThereIsAre],
    "Ética": [genBioticAbiotic],
    "Mixto": [genSpanishPunctuation, genMathUnitsTens, genEnglishColorTranslate, genEnglishFamilyTranslate, genThereIsAre, genBioticAbiotic],
  };

  function generateQuestions(subject, count, phase){
    const gens = GENERATORS[subject] || GENERATORS["Mixto"];
    const out = [];
    while (out.length < count) out.push(choice(gens)(phase));
    return shuffle(out);
  }

  /* -------------------------
     Session state
  -------------------------- */
  const state = {
    parentsHelp: false,
    subject: "Mixto",
    source: "mixed",     // mixed | bank | generated
    total: 20,
    mode: "practice",    // practice | exam
    shuffle: true,
    phase: "P1-F1",

    index: 0,
    questions: [],
    answers: [],
    locked: false,
    lastSessionConfig: null,
  };

  /* -------------------------
     Build session
  -------------------------- */
  function bankPool(subject, phase){
    let pool = BANK.filter(q => q.phase === phase);
    if (!pool.length) pool = BANK.slice();
    if (subject === "Mixto") return pool;
    return pool.filter(q => q.subject === subject);
  }

 function pickFromBank(subject, total, doShuffle, phase){
  let pool = bankPool(subject, phase);
  if (!pool.length) pool = BANK.slice();

  // shuffle to avoid same order
  if (doShuffle) pool = shuffle(pool);

  // IMPORTANT: do not repeat within the session
  return pool.slice(0, total);
    }
    return chosen.slice(0, total);
  }

  function buildSessionQuestions({subject,total,doShuffle,source,phase}){
  const want = total;

  if (source === "bank") {
    const bankPoolList = pickFromBank(subject, want, doShuffle, phase);

    // If bank doesn't have enough questions, fill the rest with generated
    if (bankPoolList.length < want) {
      const missing = want - bankPoolList.length;
      const genPart = generateQuestions(subject, missing, phase);
      let qs = [...bankPoolList, ...genPart];
      qs = doShuffle ? shuffle(qs) : qs;
      return qs.slice(0, want);
    }

    return bankPoolList;
  }

  if (source === "generated") {
    const qs = generateQuestions(subject, want, phase);
    return doShuffle ? shuffle(qs) : qs;
  }

  // mixed
  const half = Math.ceil(want/2);
  const bankPart = pickFromBank(subject, half, doShuffle, phase);
  const genPart  = generateQuestions(subject, want - bankPart.length, phase);

  let qs = [...bankPart, ...genPart];
  qs = doShuffle ? shuffle(qs) : qs;
  return qs.slice(0, want);
  }

  /* -------------------------
     UI
  -------------------------- */
  function showScreen(name){
    Object.values(screens).forEach(s => s.classList.add("hidden"));
    screens[name].classList.remove("hidden");
  }

  function setParentsHelp(on){
    state.parentsHelp = on;
    parentsToggleBtn.setAttribute("aria-pressed", on ? "true" : "false");
    parentsToggleBtn.textContent = on ? "👨‍👩‍👦 Ayuda para padres: ON" : "👨‍👩‍👦 Ayuda para padres: OFF";
    pillParents.textContent = on ? "Ayuda: ON" : "Ayuda: OFF";
    resultsParentsPill.textContent = on ? "Ayuda: ON" : "Ayuda: OFF";
    revealBtn.classList.toggle("hidden", !on);

    hintLine.textContent = on
      ? "Tip papás: si falla, revelen la correcta y den 1 explicación corta."
      : (state.mode === "practice" ? "Tip: En práctica te avisa al momento." : "Tip: En examen, resultados al final.");
  }

  function sessionSourceLabel(v){
    if (v === "bank") return "Banco";
    if (v === "generated") return "Generadas";
    return "Mixto";
  }
  function originLabel(origin){
    return origin === "bank" ? "Fuente: Banco" : "Fuente: Generada";
  }

  function renderQuiz(){
    const q = state.questions[state.index];

    state.locked = false;
    nextBtn.disabled = true;

    pillProgress.textContent = `${state.index+1}/${state.total}`;
    pillSubject.textContent = state.subject === "Ética" ? "Conocimiento del medio" : state.subject;
    pillSource.textContent = sessionSourceLabel(state.source);

    if (pillOrigin) {
      pillOrigin.textContent = originLabel(q.origin);
      pillOrigin.classList.toggle("pill-bank", q.origin === "bank");
      pillOrigin.classList.toggle("pill-gen", q.origin !== "bank");
    }

    topicLine.textContent = `Tema: ${q.topic}`;
    promptEl.textContent = q.prompt;

    feedbackEl.classList.add("hidden");
    feedbackEl.classList.remove("ok","bad");
    feedbackEl.textContent = "";

    optionsEl.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const b = document.createElement("button");
      b.className = "optionBtn";
      b.textContent = opt;
      b.addEventListener("click", () => choose(idx));
      optionsEl.appendChild(b);
    });

    setParentsHelp(state.parentsHelp);
  }

  function markOptions(chosenIndex){
    const q = state.questions[state.index];
    const btns = Array.from(optionsEl.querySelectorAll("button"));
    btns.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answerIndex) b.classList.add("correct");
      if (i === chosenIndex && i !== q.answerIndex) b.classList.add("wrong");
    });
  }

  function choose(chosenIndex){
    if (state.locked) return;
    state.locked = true;

    const q = state.questions[state.index];
    const correct = chosenIndex === q.answerIndex;

    state.answers.push({ qid: q.id, chosenIndex, correct });

    markOptions(chosenIndex);
    nextBtn.disabled = false;

    if (state.mode === "practice"){
      feedbackEl.classList.remove("hidden");
      feedbackEl.classList.add(correct ? "ok" : "bad");
      if (correct){
        feedbackEl.textContent = "✅ ¡Correcto!";
      } else {
        const exp = (state.parentsHelp && q.explanation) ? `\n💡 ${q.explanation}` : "";
        feedbackEl.textContent = `❌ Ups. La correcta era: "${q.options[q.answerIndex]}".${exp}`;
      }
    }
  }

  function revealAnswer(){
    if (!state.parentsHelp) return;
    const q = state.questions[state.index];
    feedbackEl.classList.remove("hidden");
    feedbackEl.classList.remove("bad");
    feedbackEl.classList.add("ok");
    const exp = q.explanation ? `\n💡 ${q.explanation}` : "";
    feedbackEl.textContent = `👁 Respuesta: "${q.options[q.answerIndex]}".${exp}`;
  }

  function next(){
    if (state.index < state.total - 1){
      state.index++;
      renderQuiz();
    } else {
      renderResults();
    }
  }

  function renderResults(){
    showScreen("results");
    setParentsHelp(state.parentsHelp);

    const correctCount = state.answers.filter(a => a.correct).length;
    const pct = Math.round((correctCount / state.total) * 100);
    scoreLine.textContent = `Aciertos: ${correctCount} / ${state.total} — (${pct}%)`;

    reviewEl.innerHTML = "";
    const ul = document.createElement("ul");
    ul.style.paddingLeft = "18px";
    ul.style.lineHeight = "1.55";

    state.questions.forEach((q, i) => {
      const a = state.answers[i];
      const li = document.createElement("li");
      const status = a.correct ? "✅" : "❌";
      li.innerHTML = `<strong>${status}</strong> ${escapeHtml(q.prompt)}<br><span class="muted">Tu respuesta: "${escapeHtml(q.options[a.chosenIndex])}"</span>`;
      li.innerHTML += `<br><span class="muted">${originLabel(q.origin)}</span>`;
      if (!a.correct && state.parentsHelp){
        li.innerHTML += `<br><span style="color: #0a7a36">Correcta: "${escapeHtml(q.options[q.answerIndex])}"</span>`;
        if (q.explanation) li.innerHTML += `<br><span class="muted">💡 ${escapeHtml(q.explanation)}</span>`;
      }
      ul.appendChild(li);
    });

    reviewEl.appendChild(ul);
  }

  function startSession(subject, forceSame=false){
    if (!forceSame){
      state.subject = subject;
      state.source = questionSource.value;
      state.total = parseInt(questionCount.value, 10);
      state.mode = sessionMode.value;
      state.shuffle = shuffleSel.value === "yes";
      state.phase = gradePhase.value || "P1-F1";

      state.lastSessionConfig = {
        subject: state.subject,
        source: state.source,
        total: state.total,
        mode: state.mode,
        shuffle: state.shuffle,
        phase: state.phase
      };
    } else {
      const c = state.lastSessionConfig;
      state.subject = c.subject;
      state.source = c.source;
      state.total = c.total;
      state.mode = c.mode;
      state.shuffle = c.shuffle;
      state.phase = c.phase;
    }

    state.index = 0;
    state.answers = [];
    state.locked = false;

    state.questions = buildSessionQuestions({
      subject: state.subject,
      total: state.total,
      doShuffle: state.shuffle,
      source: state.source,
      phase: state.phase
    });

    showScreen("quiz");
    renderQuiz();
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /* -------------------------
     Events
  -------------------------- */
  parentsToggleBtn.addEventListener("click", () => setParentsHelp(!state.parentsHelp));
  qsa(".tile").forEach(btn => btn.addEventListener("click", () => startSession(btn.dataset.subject)));
  startMixedBtn.addEventListener("click", () => startSession("Mixto"));

  homeBtn1.addEventListener("click", () => showScreen("home"));
  homeBtn2.addEventListener("click", () => showScreen("home"));

  revealBtn.addEventListener("click", revealAnswer);
  nextBtn.addEventListener("click", next);

  retryBtn.addEventListener("click", () => {
    if (!state.lastSessionConfig) return showScreen("home");
    startSession(state.lastSessionConfig.subject, true);
  });
  newBtn.addEventListener("click", () => showScreen("home"));

  // Init
  setParentsHelp(false);
  showScreen("home");

})();
