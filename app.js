/* =========================================================
   Zaíd Smart Test — app.js (FULL)
   Static + No build
   - Banco (Opción 1) + Generador (Opción 2)
   - Ayuda para padres visible (toggle) + botón "Ver respuesta"
   - Botón "← Inicio" en quiz y resultados
   - 10–40 preguntas por sesión
========================================================= */

(() => {
  "use strict";

  /* -------------------------
     DOM Helpers
  -------------------------- */
  const $ = (id) => document.getElementById(id);
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  /* -------------------------
     UI Nodes
  -------------------------- */
  const screens = {
    home: $("screen-home"),
    quiz: $("screen-quiz"),
    results: $("screen-results"),
  };

  const parentsToggleBtn = $("parentsToggleBtn");
  const pillParents = $("pillParents");
  const resultsParentsPill = $("resultsParentsPill");

  const gradePhase = $("gradePhase");
  const questionSource = $("questionSource");
  const questionCount = $("questionCount");
  const sessionMode = $("sessionMode");
  const difficulty = $("difficulty");
  const shuffleSel = $("shuffle");

  const startMixedBtn = $("startMixedBtn");

  const homeBtn1 = $("homeBtn1");
  const homeBtn2 = $("homeBtn2");

  const pillProgress = $("pillProgress");
  const pillSubject = $("pillSubject");
  const pillSource = $("pillSource");

  const topicLine = $("topicLine");
  const promptEl = $("prompt");
  const optionsEl = $("options");
  const feedbackEl = $("feedback");
  const nextBtn = $("nextBtn");
  const revealBtn = $("revealBtn");
  const hintLine = $("hintLine");

  const scoreLine = $("scoreLine");
  const reviewEl = $("review");
  const retryBtn = $("retryBtn");
  const newBtn = $("newBtn");

  /* -------------------------
     Data: Bank (Fase 1)
     - Puedes crecer por fases y grados
  -------------------------- */
  const BANK = [
    // Español
    { id:"esp-1", phase:"P1-F1", subject:"Español", topic:"Cuento", prompt:"¿Cuáles son las partes de un cuento?", options:["Inicio, desarrollo y final","Verso, estrofa y rima","Regla, instrucción y tablero"], answerIndex:0, explanation:"Un cuento tiene inicio, desarrollo y final." },
    { id:"esp-2", phase:"P1-F1", subject:"Español", topic:"Cuento", prompt:"¿Qué es un personaje principal?", options:["El más importante de la historia","Un lugar","Una regla"], answerIndex:0, explanation:"El personaje principal es el más importante." },
    { id:"esp-3", phase:"P1-F1", subject:"Español", topic:"Carta", prompt:"¿Qué va al inicio de una carta?", options:["Lugar y fecha","Firma","Despedida"], answerIndex:0, explanation:"Al inicio va lugar y fecha." },
    { id:"esp-4", phase:"P1-F1", subject:"Español", topic:"Puntuación", prompt:"¿Qué signo son los dos puntos?", options:[":",".","¿ ?"], answerIndex:0, explanation:"Los dos puntos se escriben así: : " },
    { id:"esp-5", phase:"P1-F1", subject:"Español", topic:"Puntuación", prompt:"¿Para qué sirven los dos puntos (:)?", options:["Para presentar una lista o explicación","Para hacer una pregunta","Para gritar"], answerIndex:0, explanation:"Sirven para presentar una lista o explicación." },
    { id:"esp-6", phase:"P1-F1", subject:"Español", topic:"Poema", prompt:"En un poema, ¿qué es un verso?", options:["Una línea del poema","El final del cuento","Una regla"], answerIndex:0, explanation:"Verso = cada línea del poema." },

    // Matemáticas
    { id:"mat-1", phase:"P1-F1", subject:"Matemáticas", topic:"Unidades y decenas", prompt:"En el número 37, ¿cuántas decenas hay?", options:["3","7","37"], answerIndex:0, explanation:"37 = 3 decenas y 7 unidades." },
    { id:"mat-2", phase:"P1-F1", subject:"Matemáticas", topic:"Figuras", prompt:"¿Cuál figura es redonda?", options:["Círculo","Rombo","Paralelogramo"], answerIndex:0, explanation:"El círculo es redondo." },
    { id:"mat-3", phase:"P1-F1", subject:"Matemáticas", topic:"Días", prompt:"¿Qué día va después del lunes?", options:["Domingo","Martes","Sábado"], answerIndex:1, explanation:"Después del lunes va martes." },
    { id:"mat-4", phase:"P1-F1", subject:"Matemáticas", topic:"Recta numérica", prompt:"Si estás en 5 y avanzas 2 a la derecha, llegas a…", options:["3","7","8"], answerIndex:1, explanation:"5 + 2 = 7." },

    // Inglés
    { id:"ing-1", phase:"P1-F1", subject:"Inglés", topic:"Colors", prompt:"¿Cómo se dice 'rojo' en inglés?", options:["Red","Blue","Green"], answerIndex:0, explanation:"Rojo = Red." },
    { id:"ing-2", phase:"P1-F1", subject:"Inglés", topic:"Family", prompt:"¿Cómo se dice 'mamá' en inglés?", options:["Dad","Mom","Grandma"], answerIndex:1, explanation:"Mamá = Mom." },
    { id:"ing-3", phase:"P1-F1", subject:"Inglés", topic:"There is/are", prompt:"Para hablar de MUCHAS cosas usamos…", options:["There is","There are","This is"], answerIndex:1, explanation:"Plural = There are." },

    // Conocimiento del medio (Ética)
    { id:"eti-1", phase:"P1-F1", subject:"Ética", topic:"Biótico/Abiótico", prompt:"¿Cuál es un factor biótico?", options:["Una planta","Una roca","El aire"], answerIndex:0, explanation:"Biótico = ser vivo." },
    { id:"eti-2", phase:"P1-F1", subject:"Ética", topic:"Empujar y jalar", prompt:"Jalar significa…", options:["Traer algo hacia ti","Alejar algo de ti","Rodar"], answerIndex:0, explanation:"Jalar = traer hacia ti." },
    { id:"eti-3", phase:"P1-F1", subject:"Ética", topic:"Cuidado del entorno", prompt:"¿Qué ayuda a cuidar tu entorno?", options:["Tirar basura al piso","Recoger basura","Romper plantas"], answerIndex:1, explanation:"Recoger basura ayuda a cuidar el entorno." },
  ];

  /* -------------------------
     Data for generators (Opción 2)
  -------------------------- */
  const GEN_DATA = {
    ingles: {
      colors: ["green","pink","gray","purple","blue","red","yellow","orange","white","brown","black"],
      family: ["dad","mom","sister","brother","grandpa","grandma"],
      snacks: ["sandwich","banana","carrot","donut","cupcake","cookie","hamburger","pear","pineapple","hot dog"]
    },
    mate: {
      shapes: ["círculo","rectángulo","cuadrado","óvalo","paralelogramo","rombo"],
      days: ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"]
    },
    etica: {
      biotic: ["planta","perro","gato","árbol","mariposa"],
      abiotic: ["agua","aire","roca","luz del sol","tierra"]
    }
  };

  /* -------------------------
     Utils
  -------------------------- */
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

  function makeMCQ({id, subject, topic, prompt, correct, distractors, difficulty="easy", explanation="", phase="P1-F1"}) {
    let options = uniq([correct, ...distractors]);
    while (options.length < 3) options.push("Ninguna de las anteriores");
    if (difficulty === "normal") while (options.length < 4) options.push(choice(["No estoy seguro","Quizá","No sé"]));
    if (difficulty === "easy") options = options.slice(0,3);
    options = shuffle(options);
    const answerIndex = options.indexOf(correct);
    return { id, subject, topic, prompt, options, answerIndex, explanation, phase, generated: true };
  }

  /* -------------------------
     Generators
  -------------------------- */
  // Español
  function genSpanishPunctuationQuestion(difficulty, phase){
    const types = [
      { prompt:"¿Qué signo son los dos puntos?", correct:":", distractors:[".","¿ ?","¡ !"], explanation:"Los dos puntos se escriben así: :" },
      { prompt:"¿Para qué sirven los dos puntos (:)?", correct:"Para presentar una lista o explicación", distractors:["Para hacer una pregunta","Para gritar","Para terminar una oración"], explanation:"Sirven para presentar una lista o explicación." },
      { prompt:"¿Qué signos usamos para hacer una pregunta?", correct:"¿ ?", distractors:["¡ !",":","."], explanation:"Las preguntas llevan ¿ ?." },
      { prompt:"¿Qué signos usamos para expresar emoción?", correct:"¡ !", distractors:["¿ ?",":","."], explanation:"La emoción lleva ¡ !." }
    ];
    const pick = choice(types);
    return makeMCQ({
      id:`gen-esp-punc-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Español",
      topic:"Puntuación",
      prompt: pick.prompt,
      correct: pick.correct,
      distractors: pick.distractors,
      difficulty,
      explanation: pick.explanation,
      phase
    });
  }

  function genSpanishStoryQuestion(difficulty, phase){
    const types = [
      { prompt:"¿Cuáles son las partes de un cuento?", correct:"Inicio, desarrollo y final", distractors:["Saludo, firma y fecha","Verso, estrofa y rima","Regla, instrucción y tablero"], explanation:"Cuento: inicio, desarrollo y final." },
      { prompt:"En un cuento, ¿qué pasa al INICIO?", correct:"Se presentan personajes y lugar", distractors:["Se resuelve el problema","Se escribe la firma","Solo hay rimas"], explanation:"Al inicio conocemos personajes y lugar." },
      { prompt:"En un cuento, ¿qué pasa al FINAL?", correct:"Termina la historia y se resuelve", distractors:["Se presenta el lugar","Se escribe la fecha","Se dan instrucciones"], explanation:"Al final se resuelve y termina." }
    ];
    const pick = choice(types);
    return makeMCQ({
      id:`gen-esp-story-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Español",
      topic:"Cuento",
      prompt: pick.prompt,
      correct: pick.correct,
      distractors: pick.distractors,
      difficulty,
      explanation: pick.explanation,
      phase
    });
  }

  function genSpanishLetterQuestion(difficulty, phase){
    const types = [
      { prompt:"¿Qué va al inicio de una carta?", correct:"Lugar y fecha", distractors:["Firma","Despedida","Tablero"], explanation:"Al inicio va lugar y fecha." },
      { prompt:"¿Qué es el saludo en una carta?", correct:"Hola / Querido...", distractors:["La fecha","Un verso","Un número"], explanation:"El saludo abre la carta." },
      { prompt:"¿Qué es la despedida en una carta?", correct:"Adiós / Con cariño...", distractors:["El título","El dado","La pregunta"], explanation:"La despedida cierra la carta." },
      { prompt:"¿Qué es la firma en una carta?", correct:"El nombre de quien envía", distractors:["El nombre de quien recibe","Un color","Una figura"], explanation:"La firma es el nombre del remitente." }
    ];
    const pick = choice(types);
    return makeMCQ({
      id:`gen-esp-letter-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Español",
      topic:"Carta",
      prompt: pick.prompt,
      correct: pick.correct,
      distractors: pick.distractors,
      difficulty,
      explanation: pick.explanation,
      phase
    });
  }

  // Matemáticas
  function genMathUnitsTensQuestion(difficulty, phase){
    const n = randInt(10, 99);
    const tens = Math.floor(n/10);
    const ones = n%10;
    const askTens = Math.random() < 0.5;
    const correct = askTens ? String(tens) : String(ones);
    const distract = shuffle([String(ones),String(tens),String(n), String(randInt(0,9))].filter(x=>x!==correct)).slice(0,3);

    return makeMCQ({
      id:`gen-mat-ud-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Matemáticas",
      topic:"Unidades y decenas",
      prompt: askTens ? `En el número ${n}, ¿cuántas decenas hay?` : `En el número ${n}, ¿cuántas unidades hay?`,
      correct,
      distractors: distract,
      difficulty,
      explanation: `${n} = ${tens} decenas y ${ones} unidades.`,
      phase
    });
  }

  function genMathShapesQuestion(difficulty, phase){
    const shape = choice(GEN_DATA.mate.shapes);
    const wrongs = shuffle(GEN_DATA.mate.shapes.filter(s=>s!==shape)).slice(0,3);
    const prompts = {
      "círculo": "¿Cuál figura es redonda?",
      "rectángulo": "¿Cuál figura parece una puerta?",
      "cuadrado": "¿Cuál figura tiene 4 lados iguales?",
      "óvalo": "¿Qué figura parece un 'huevo'?",
      "paralelogramo": "¿Cuál figura parece un rectángulo inclinado?",
      "rombo": "¿Cuál figura parece un diamante?"
    };
    return makeMCQ({
      id:`gen-mat-shape-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Matemáticas",
      topic:"Figuras",
      prompt: prompts[shape] || "Elige la figura correcta:",
      correct: shape,
      distractors: wrongs,
      difficulty,
      explanation: `La respuesta correcta es: ${shape}.`,
      phase
    });
  }

  function genMathDaysQuestion(difficulty, phase){
    const days = GEN_DATA.mate.days;
    const i = randInt(0, days.length-1);
    const day = days[i];
    const next = days[(i+1)%days.length];
    const prev = days[(i-1+days.length)%days.length];
    const askNext = Math.random() < 0.5;
    const correct = askNext ? next : prev;

    return makeMCQ({
      id:`gen-mat-day-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Matemáticas",
      topic:"Días",
      prompt: askNext ? `¿Qué día va después del ${day}?` : `¿Qué día va antes del ${day}?`,
      correct,
      distractors: shuffle(days.filter(d=>d!==correct)).slice(0,3),
      difficulty,
      explanation: askNext ? `Después del ${day} va ${next}.` : `Antes del ${day} va ${prev}.`,
      phase
    });
  }

  // Inglés
  function genEnglishColorQuestion(difficulty, phase){
    const color = choice(GEN_DATA.ingles.colors);
    return makeMCQ({
      id:`gen-ing-color-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Inglés",
      topic:"Colors",
      prompt:"¿Cuál palabra es un color?",
      correct: color,
      distractors: [choice(GEN_DATA.ingles.family), choice(GEN_DATA.ingles.snacks), choice(GEN_DATA.ingles.colors.filter(c=>c!==color))],
      difficulty,
      explanation: `Color = ${color}.`,
      phase
    });
  }

  function genEnglishFamilyQuestion(difficulty, phase){
    const fam = choice(GEN_DATA.ingles.family);
    return makeMCQ({
      id:`gen-ing-family-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Inglés",
      topic:"Family",
      prompt:"¿Cuál palabra es de la familia?",
      correct: fam,
      distractors: [choice(GEN_DATA.ingles.colors), choice(GEN_DATA.ingles.snacks), choice(GEN_DATA.ingles.family.filter(x=>x!==fam))],
      difficulty,
      explanation: `Familia = ${fam}.`,
      phase
    });
  }

  function genThereIsAreQuestion(difficulty, phase){
    const plural = Math.random() < 0.5;
    return makeMCQ({
      id:`gen-ing-there-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Inglés",
      topic:"There is / There are",
      prompt: plural ? "Para hablar de MUCHAS cosas usamos…" : "Para UNA cosa usamos…",
      correct: plural ? "There are" : "There is",
      distractors: plural ? ["There is","This is","They are"] : ["There are","They are","This is"],
      difficulty,
      explanation: plural ? "Plural = There are." : "Singular = There is.",
      phase
    });
  }

  // Ética
  function genBioticAbioticQuestion(difficulty, phase){
    const askBiotic = Math.random() < 0.5;
    const correct = askBiotic ? choice(GEN_DATA.etica.biotic) : choice(GEN_DATA.etica.abiotic);
    const distractors = askBiotic ? shuffle(GEN_DATA.etica.abiotic).slice(0,3) : shuffle(GEN_DATA.etica.biotic).slice(0,3);

    return makeMCQ({
      id:`gen-eti-factor-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject:"Ética",
      topic:"Biótico/Abiótico",
      prompt: askBiotic ? "¿Cuál es un factor biótico?" : "¿Cuál es un factor abiótico?",
      correct,
      distractors,
      difficulty,
      explanation: askBiotic ? "Biótico = ser vivo." : "Abiótico = no vivo.",
      phase
    });
  }

  const GENERATORS = [
    genSpanishPunctuationQuestion,
    genSpanishStoryQuestion,
    genSpanishLetterQuestion,
    genMathUnitsTensQuestion,
    genMathShapesQuestion,
    genMathDaysQuestion,
    genEnglishColorQuestion,
    genEnglishFamilyQuestion,
    genThereIsAreQuestion,
    genBioticAbioticQuestion,
  ];

  function generateQuestions(subject, count, variants, difficulty, phase){
    const pool = [];
    const target = Math.max(count * variants, count);

    const gens = GENERATORS.filter(fn => {
      const name = fn.name;
      if (subject === "Mixto") return true;
      if (subject === "Español") return name.includes("Spanish");
      if (subject === "Matemáticas") return name.includes("Math");
      if (subject === "Inglés") return name.includes("English") || name.includes("There");
      if (subject === "Ética") return name.includes("Biotic");
      return true;
    });

    while (pool.length < target) {
      pool.push(choice(gens)(difficulty, phase));
    }
    return shuffle(pool).slice(0, count);
  }

  /* -------------------------
     Session state
  -------------------------- */
  const state = {
    parentsHelp: false,
    subject: "Mixto",
    source: "mixed",
    total: 20,
    mode: "practice",
    variants: 2,
    difficulty: "easy",
    shuffle: true,
    phase: "P1-F1",

    index: 0,
    questions: [],
    answers: [],
    locked: false,
    lastSessionConfig: null,
  };

  /* -------------------------
     Build session questions
  -------------------------- */
  function bySubjectAndPhaseFromBank(subject, phase){
    let pool = BANK.filter(q => q.phase === phase);
    if (subject === "Mixto") return pool.slice();
    return pool.filter(q => q.subject === subject);
  }

  function pickFromBank(subject, total, doShuffle, phase){
    let pool = bySubjectAndPhaseFromBank(subject, phase);
    if (!pool.length) pool = BANK.slice(); // fallback if phase empty
    if (doShuffle) pool = shuffle(pool);

    const chosen = [];
    let k = 0;
    while (chosen.length < total) {
      chosen.push(pool[k % pool.length]);
      k++;
    }
    return chosen.slice(0, total);
  }

  function mergeUnique(a, b){
    const m = new Map();
    [...a, ...b].forEach(q => m.set(q.id, q));
    return Array.from(m.values());
  }

  function buildSessionQuestions({subject,total,doShuffle,source,variants,difficulty,phase}){
    let qs = [];
    if (source === "bank"){
      qs = pickFromBank(subject, total, doShuffle, phase);
    } else if (source === "generated"){
      qs = generateQuestions(subject, total, variants, difficulty, phase);
    } else {
      const half = Math.ceil(total/2);
      const bankPart = pickFromBank(subject, half, doShuffle, phase);
      const genPart  = generateQuestions(subject, total-half, variants, difficulty, phase);
      qs = mergeUnique(bankPart, genPart);
      if (qs.length < total){
        qs = qs.concat(pickFromBank(subject, total-qs.length, true, phase));
      }
      if (doShuffle) qs = shuffle(qs);
      qs = qs.slice(0, total);
    }
    return qs;
  }

  /* -------------------------
     UI transitions
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
      ? "Tip papás: pueden revelar la respuesta y explicarla en 1 frase. 💪"
      : (state.mode === "practice" ? "Tip: En práctica te avisa al momento." : "Tip: En examen, resultados al final.");
  }

  /* -------------------------
     Render quiz
  -------------------------- */
  function renderQuiz(){
    const q = state.questions[state.index];

    state.locked = false;
    nextBtn.disabled = true;

    pillProgress.textContent = `${state.index+1}/${state.total}`;
    pillSubject.textContent = state.subject === "Ética" ? "Conocimiento del medio" : state.subject;
    pillSource.textContent = state.source === "mixed" ? "Mixto" : (state.source === "bank" ? "Banco" : "Generadas");

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

  /* -------------------------
     Results
  -------------------------- */
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
      if (!a.correct && state.parentsHelp){
        li.innerHTML += `<br><span style="color: var(--ok)">Correcta: "${escapeHtml(q.options[q.answerIndex])}"</span>`;
        if (q.explanation) li.innerHTML += `<br><span class="muted">💡 ${escapeHtml(q.explanation)}</span>`;
      }
      ul.appendChild(li);
    });

    reviewEl.appendChild(ul);
  }

  /* -------------------------
     Events
  -------------------------- */
  parentsToggleBtn.addEventListener("click", () => setParentsHelp(!state.parentsHelp));

  qsa(".tile").forEach(btn => {
    btn.addEventListener("click", () => startSession(btn.dataset.subject));
  });

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

  /* -------------------------
     Start session
  -------------------------- */
  function startSession(subject, forceSameConfig=false){
    if (!forceSameConfig) {
      state.subject = subject;
      state.source = questionSource.value;
      state.total = parseInt(questionCount.value, 10);
      state.mode = sessionMode.value;
      state.difficulty = difficulty.value;
      state.shuffle = shuffleSel.value === "yes";
      state.variants = 2; // puedes exponerlo si quieres (variantsSel)
      state.phase = gradePhase.value || "P1-F1";

      state.lastSessionConfig = {
        subject: state.subject,
        source: state.source,
        total: state.total,
        mode: state.mode,
        difficulty: state.difficulty,
        shuffle: state.shuffle,
        variants: state.variants,
        phase: state.phase
      };
    } else {
      // replay uses stored config
      const c = state.lastSessionConfig;
      state.subject = c.subject;
      state.source = c.source;
      state.total = c.total;
      state.mode = c.mode;
      state.difficulty = c.difficulty;
      state.shuffle = c.shuffle;
      state.variants = c.variants;
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
      variants: state.variants,
      difficulty: state.difficulty,
      phase: state.phase
    });

    showScreen("quiz");
    renderQuiz();
  }

  /* -------------------------
     Init
  -------------------------- */
  setParentsHelp(false);
  showScreen("home");

  /* -------------------------
     Escape HTML
  -------------------------- */
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

})();
