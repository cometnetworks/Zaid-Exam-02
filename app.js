/* =========================================================
   Zaíd Smart Test — app.js (FULL)
   - 40 preguntas por ÍTEM del temario (generadas por plantillas)
   - No repite dentro de sesión
   - Mixto: mezcla ítems de todas las materias
   - Ayuda para padres visible + "Ver respuesta"
========================================================= */

(() => {
  "use strict";

  /* ---------- DOM helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  /* ---------- UI nodes ---------- */
  const screens = {
    home: $("screen-home"),
    quiz: $("screen-quiz"),
    results: $("screen-results"),
  };

  const parentsToggleBtn = $("parentsToggleBtn");
  const pillParents = $("pillParents");
  const resultsParentsPill = $("resultsParentsPill");

  const questionCount = $("questionCount");
  const sessionMode = $("sessionMode");
  const difficultySel = $("difficulty");
  const shuffleSel = $("shuffle");

  const startMixedBtn = $("startMixedBtn");
  const itemsHint = $("itemsHint");
  const itemsList = $("itemsList");

  const homeBtn1 = $("homeBtn1");
  const homeBtn2 = $("homeBtn2");

  const pillProgress = $("pillProgress");
  const pillSubject = $("pillSubject");
  const pillItem = $("pillItem");

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

  /* ---------- State ---------- */
  const state = {
    parentsHelp: false,
    subject: "Mixto",
    itemId: "mixed",
    total: 20,
    mode: "practice",
    difficulty: "easy",
    shuffle: true,

    index: 0,
    questions: [],
    answers: [],
    locked: false,
    lastSessionConfig: null,
  };

  /* ---------- Random (seeded) ---------- */
  function xmur3(str){
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++){
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function(){
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return h >>> 0;
    };
  }
  function mulberry32(a){
    return function(){
      let t = (a += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seedStr){
    const seed = xmur3(seedStr)();
    return mulberry32(seed);
  }
  function rInt(rng, a, b){ return Math.floor(rng() * (b - a + 1)) + a; }
  function pick(rng, arr){ return arr[rInt(rng, 0, arr.length - 1)]; }
  function shuffle(rng, arr){
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--){
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function uniq(arr){ return Array.from(new Set(arr)); }

  /* ---------- Question builder ---------- */
  function mcq({ id, subject, itemId, topic, prompt, correct, distractors, explanation }){
    let options = uniq([correct, ...distractors]);
    while (options.length < 3) options.push("Ninguna de las anteriores");
    options = options.slice(0, 4);
    // shuffle options (non-seeded is fine per question)
    const rng = makeRng(id + "|opts");
    options = shuffle(rng, options);
    const answerIndex = options.indexOf(correct);

    return {
      id, subject, itemId, topic, prompt,
      options, answerIndex,
      explanation: explanation || ""
    };
  }

  /* =========================================================
     TEMARIO (extraído del PDF)
     Español (9), Matemáticas (14), Inglés (7), Ética (9)
     => Cada ítem produce 40 preguntas por plantillas.
  ========================================================== */

  const EN = {
    colors: [
      { es:"verde", en:"green" }, { es:"rosa", en:"pink" }, { es:"gris", en:"gray" },
      { es:"morado", en:"purple" }, { es:"azul", en:"blue" }, { es:"rojo", en:"red" },
      { es:"amarillo", en:"yellow" }, { es:"naranja", en:"orange" }, { es:"blanco", en:"white" },
      { es:"café", en:"brown" }, { es:"negro", en:"black" }
    ],
    family: [
      { es:"papá", en:"dad" }, { es:"mamá", en:"mom" }, { es:"hermana", en:"sister" },
      { es:"hermano", en:"brother" }, { es:"abuelo", en:"grandpa" }, { es:"abuela", en:"grandma" }
    ],
    snacks: [
      { es:"sándwich", en:"sandwich" }, { es:"plátano", en:"banana" }, { es:"zanahoria", en:"carrot" },
      { es:"dona", en:"donut" }, { es:"cupcake", en:"cupcake" }, { es:"galleta", en:"cookie" },
      { es:"hamburguesa", en:"hamburger" }, { es:"pera", en:"pear" }, { es:"piña", en:"pineapple" },
      { es:"hot dog", en:"hot dog" }
    ]
  };

  const NAHUATL = [
    { word:"chocolate", meaning:"bebida o dulce de cacao" },
    { word:"tomate", meaning:"fruto rojo para cocinar" },
    { word:"aguacate", meaning:"fruto verde cremoso" },
    { word:"elote", meaning:"maíz tierno" },
    { word:"chile", meaning:"picante" },
    { word:"atole", meaning:"bebida caliente de maíz" },
    { word:"comal", meaning:"plancha para cocinar tortillas" },
    { word:"coyote", meaning:"animal parecido a un perro salvaje" }
  ];

  const ITEMS = [
    // Español
    item("Español", "esp-notas", "Notas informativas (partes)", genEspanolNotas),
    item("Español", "esp-poema", "Poema: verso, estrofa, rima, onomatopeyas", genEspanolPoema),
    item("Español", "esp-juego", "Juego de mesa: regla vs instrucción", genEspanolJuegoMesa),
    item("Español", "esp-carta", "La carta: partes, remitente y destinatario", genEspanolCarta),
    item("Español", "esp-contexto", "Contexto familiar y escolar", genEspanolContextos),
    item("Español", "esp-nahuatl", "Palabras en Náhuatl", genEspanolNahuatl),
    item("Español", "esp-vivencias", "Describir vivencias: visual y sonoro", genEspanolVivencias),
    item("Español", "esp-cuento", "El cuento: partes, personajes, orden de sucesos", genEspanolCuento),
    item("Español", "esp-teatro", "Obra de teatro: diálogo y signos (¿? ¡! :)", genEspanolTeatro),

    // Matemáticas
    item("Matemáticas", "mat-1-150", "Números del 1 al 150", genMatNumeros150),
    item("Matemáticas", "mat-1-100", "Escritura de números del 1 al 100", genMatEscritura100),
    item("Matemáticas", "mat-figuras", "Figuras geométricas (círculo, rectángulo, ...)", genMatFiguras),
    item("Matemáticas", "mat-tangram", "Tangram (piezas y origen)", genMatTangram),
    item("Matemáticas", "mat-vertices", "Vértices y lados (curvos/rectos)", genMatVerticesLados),
    item("Matemáticas", "mat-agrupacion", "Agrupación 2 en 2, 5 en 5, 10 en 10", genMatAgrupacion),
    item("Matemáticas", "mat-medidas", "Medidas: largo/corto", genMatMedidas),
    item("Matemáticas", "mat-ud", "Unidades y decenas", genMatUnidadesDecenas),
    item("Matemáticas", "mat-recta", "Suma y resta con recta numérica", genMatRectaNumerica),
    item("Matemáticas", "mat-descomp", "Descomposición aditiva", genMatDescompAditiva),
    item("Matemáticas", "mat-problemas", "Problemas (suma/resta) con descomposición", genMatProblemas),
    item("Matemáticas", "mat-semana", "Días de la semana: antes/después", genMatDiasSemana),
    item("Matemáticas", "mat-ayerhoy", "Ayer, hoy y mañana", genMatAyerHoyManana),
    item("Matemáticas", "mat-peso", "Objetos ligeros y pesados", genMatPeso),

    // Inglés
    item("Inglés", "ing-colors", "Unit 3: Colors Everywhere (vocab + grammar)", genInglesColors),
    item("Inglés", "ing-colors-grammar", "Unit 3: What color is it/are they", genInglesColorsGrammar),
    item("Inglés", "ing-family", "Unit 4: My Family (vocab)", genInglesFamily),
    item("Inglés", "ing-alphabet", "Unit 4: Alphabet A–Z", genInglesAlphabet),
    item("Inglés", "ing-this-that", "Unit 4: This is/That is + Who is this/that", genInglesThisThat),
    item("Inglés", "ing-snacks", "Unit 5: Snack Time (vocab)", genInglesSnacks),
    item("Inglés", "ing-there", "Unit 5: There is / There are", genInglesThereIsAre),

    // Ética
    item("Ética", "eti-bio", "Factores bióticos y abióticos", genEticaBiotico),
    item("Ética", "eti-plantas", "Plantas con flores, sin flores y con frutos", genEticaPlantas),
    item("Ética", "eti-entornos", "Entornos naturales", genEticaEntornos),
    item("Ética", "eti-animales", "Animales nocturnos/diurnos y sin huesos", genEticaAnimales),
    item("Ética", "eti-mov", "Movimientos: deslizar, rodar y girar", genEticaMovimientos),
    item("Ética", "eti-empujar", "Empujar y jalar", genEticaEmpujarJalar),
    item("Ética", "eti-respeto", "Respeto a los seres vivos", genEticaRespeto),
    item("Ética", "eti-recursos", "Recursos naturales y utilidad", genEticaRecursos),
    item("Ética", "eti-cuidado", "Cuidado de mi entorno", genEticaCuidado),
  ];

  function item(subject, id, title, gen){
    return { subject, id, title, gen };
  }

  /* ---------- Generators: Español ---------- */
  function genEspanolNotas(rng, meta){
    const parts = ["título", "fecha", "lugar", "qué pasó", "quién", "cuándo", "dónde", "por qué", "cómo"];
    const templates = [
      () => mcq({
        id: qid(meta, "p1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Para qué sirve una nota informativa?",
        correct: "Para informar sobre un hecho real",
        distractors: ["Para inventar un cuento", "Para jugar un juego de mesa", "Para dibujar sin explicar"],
        explanation: "Una nota informativa cuenta un hecho real para informar."
      }),
      () => {
        const p = pick(rng, parts);
        return mcq({
          id: qid(meta, "p2-"+p),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Cuál de estas puede ser una parte de una nota informativa?`,
          correct: p,
          distractors: shuffle(rng, ["rima", "estrofa", "personaje ficticio", "tablero"]).slice(0,3),
          explanation: "Las notas informativas incluyen datos como: qué pasó, cuándo, dónde, etc."
        });
      },
      () => mcq({
        id: qid(meta, "p3"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "En una nota informativa, ¿qué significa “¿qué pasó?”",
        correct: "El hecho o suceso que ocurrió",
        distractors: ["La despedida", "El personaje principal", "La rima del poema"],
        explanation: "“Qué pasó” es el hecho que ocurrió."
      }),
    ];
    return build40(rng, templates, meta);
  }

  function genEspanolPoema(rng, meta){
    const onos = ["miau", "guau", "tic-tac", "pum", "zas", "crash", "pío pío"];
    const templates = [
      () => mcq({
        id: qid(meta, "v1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "En un poema, ¿qué es un verso?",
        correct: "Una línea del poema",
        distractors: ["El título del cuento", "Una regla del juego", "La fecha de una carta"],
        explanation: "Verso = una línea."
      }),
      () => mcq({
        id: qid(meta, "v2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué es una estrofa?",
        correct: "Un grupo de versos",
        distractors: ["Una instrucción", "Un personaje", "Un dibujo"],
        explanation: "Estrofa = grupo de versos."
      }),
      () => {
        const a = pick(rng, ["casa", "sala", "taza", "pasa"]);
        const b = pick(rng, ["luna", "cuna", "una", "laguna"]);
        return mcq({
          id: qid(meta, "rima-"+a+"-"+b),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: "¿Cuál par de palabras rima?",
          correct: `${a} - ${pick(rng, ["sala","taza","pasa"])}`,
          distractors: [`${a} - ${b}`, `${b} - casa`, `mesa - luna`],
          explanation: "Riman cuando suenan parecido al final."
        });
      },
      () => {
        const ono = pick(rng, onos);
        return mcq({
          id: qid(meta, "ono-"+ono),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: "¿Cuál es una onomatopeya?",
          correct: ono,
          distractors: shuffle(rng, ["mesa", "verde", "cuaderno", "escuela"]).slice(0,3),
          explanation: "Onomatopeya = palabra que imita un sonido."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genEspanolJuegoMesa(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "j1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "En un juego de mesa, ¿qué es una REGLA?",
        correct: "Lo que se debe cumplir para jugar bien",
        distractors: ["El dibujo de la portada", "La rima del poema", "El lugar y fecha de una carta"],
        explanation: "Las reglas dicen lo que se permite y no se permite."
      }),
      () => mcq({
        id: qid(meta, "j2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "En un juego de mesa, ¿qué es una INSTRUCCIÓN?",
        correct: "Los pasos que te dicen qué hacer",
        distractors: ["El título del cuento", "Un personaje ficticio", "Una onomatopeya"],
        explanation: "Instrucción = pasos para hacer algo."
      }),
      () => mcq({
        id: qid(meta, "j3"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Cuál ejemplo parece una regla?",
        correct: "No se puede mover dos veces en el mismo turno",
        distractors: ["Primero tira el dado", "Después avanza", "Luego guarda las cartas"],
        explanation: "Regla = lo que no se debe romper."
      }),
    ];
    return build40(rng, templates, meta);
  }

  function genEspanolCarta(rng, meta){
    const parts = ["lugar", "fecha", "saludo", "cuerpo", "despedida", "firma", "remitente", "destinatario"];
    const templates = [
      () => {
        const p = pick(rng, parts);
        return mcq({
          id: qid(meta, "carta-part-"+p),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: "¿Cuál puede ser una parte de una carta?",
          correct: p,
          distractors: shuffle(rng, ["rima", "verso", "tablero", "acotación"]).slice(0,3),
          explanation: "Una carta tiene partes como saludo, cuerpo, despedida, firma…"
        });
      },
      () => mcq({
        id: qid(meta, "remitente"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Quién es el remitente?",
        correct: "Quien envía la carta",
        distractors: ["Quien recibe la carta", "El personaje del cuento", "El que canta el poema"],
        explanation: "Remitente = quien envía."
      }),
      () => mcq({
        id: qid(meta, "destinatario"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Quién es el destinatario?",
        correct: "Quien recibe la carta",
        distractors: ["Quien envía la carta", "El narrador", "El público del teatro"],
        explanation: "Destinatario = quien recibe."
      }),
    ];
    return build40(rng, templates, meta);
  }

  function genEspanolContextos(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "ctx1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué es el contexto familiar?",
        correct: "Lo que pasa en casa y con mi familia",
        distractors: ["Lo que pasa en el recreo", "Las reglas del tangram", "Los colores en inglés"],
        explanation: "Familiar = casa, familia, actividades del hogar."
      }),
      () => mcq({
        id: qid(meta, "ctx2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué es el contexto escolar?",
        correct: "Lo que pasa en la escuela (clases, maestros, compañeros)",
        distractors: ["Lo que pasa solo en casa", "Un cuento de fantasía", "Una receta de cocina"],
        explanation: "Escolar = escuela, salón, tareas, maestros."
      }),
      () => {
        const ex = pick(rng, [
          { p:"Hacer tarea con mamá en casa", c:"contexto familiar" },
          { p:"Leer en clase con la maestra", c:"contexto escolar" },
          { p:"Jugar con mis primos en casa", c:"contexto familiar" },
          { p:"Formación y honores a la bandera", c:"contexto escolar" }
        ]);
        return mcq({
          id: qid(meta, "ctx3-"+ex.c),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `“${ex.p}” pertenece al…`,
          correct: ex.c,
          distractors: shuffle(rng, ["contexto escolar", "contexto familiar"].filter(x => x !== ex.c)),
          explanation: "Piensa si sucede en casa o en la escuela."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genEspanolNahuatl(rng, meta){
    const templates = [
      () => {
        const w = pick(rng, NAHUATL);
        return mcq({
          id: qid(meta, "nah-"+w.word),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Cuál palabra viene del Náhuatl?`,
          correct: w.word,
          distractors: shuffle(rng, ["cuaderno", "ventana", "zapato", "casa"]).slice(0,3),
          explanation: `Ejemplo: "${w.word}" es una palabra de origen náhuatl.`
        });
      },
      () => {
        const w = pick(rng, NAHUATL);
        return mcq({
          id: qid(meta, "nah-mean-"+w.word),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Qué significa aproximadamente "${w.word}"?`,
          correct: w.meaning,
          distractors: shuffle(rng, NAHUATL.filter(x=>x.word!==w.word).map(x=>x.meaning)).slice(0,3),
          explanation: `Se asocia con: ${w.meaning}.`
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genEspanolVivencias(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "viv1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué es describir una vivencia?",
        correct: "Contar algo que me pasó (con detalles)",
        distractors: ["Inventar una regla", "Decir solo un color", "Escribir el alfabeto"],
        explanation: "Vivencia = experiencia que viviste."
      }),
      () => mcq({
        id: qid(meta, "viv2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Un formato VISUAL puede ser…",
        correct: "Un dibujo o una foto",
        distractors: ["Un sonido", "Un eco", "Un grito"],
        explanation: "Visual = lo que vemos."
      }),
      () => mcq({
        id: qid(meta, "viv3"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Un formato SONORO puede ser…",
        correct: "Una grabación de voz",
        distractors: ["Una foto", "Un dibujo", "Un color"],
        explanation: "Sonoro = lo que escuchamos."
      }),
      () => {
        const seq = pick(rng, [
          ["Llegué a la escuela", "Entré al salón", "Saludé a la maestra"],
          ["Me lavé las manos", "Me senté a comer", "Lavé mi plato"],
          ["Me puse zapatos", "Salí de casa", "Subí al coche"]
        ]);
        const correct = seq.join(" → ");
        const wrong = shuffle(rng, seq.slice()).reverse().join(" → ");
        return mcq({
          id: qid(meta, "viv-orden-"+seq[0]),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: "¿Cuál está en orden correcto?",
          correct,
          distractors: [wrong, shuffle(rng, seq.slice()).join(" → "), "No importa el orden"],
          explanation: "Para contar una vivencia, ordenamos lo que pasó primero y después."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genEspanolCuento(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "cu1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Cuáles son las partes de un cuento?",
        correct: "Inicio, desarrollo y final",
        distractors: ["Verso, estrofa y rima", "Saludo, firma y fecha", "Tablero, dado y fichas"],
        explanation: "Cuento: inicio, desarrollo, final."
      }),
      () => mcq({
        id: qid(meta, "cu2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué es un personaje principal?",
        correct: "El más importante de la historia",
        distractors: ["El lugar", "La fecha", "Una regla"],
        explanation: "Principal = el más importante."
      }),
      () => mcq({
        id: qid(meta, "cu3"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué es un personaje secundario?",
        correct: "Aparece, pero no es el principal",
        distractors: ["Nunca aparece", "Es la portada", "Siempre es el héroe"],
        explanation: "Secundario = acompaña, no es el principal."
      }),
      () => {
        const seq = pick(rng, [
          ["El niño encontró una llave", "Abrió la puerta", "Encontró un tesoro"],
          ["La niña sembró una semilla", "La regó", "Creció una planta"],
          ["El perro olió comida", "Corrió a la cocina", "Comió croquetas"]
        ]);
        const correct = seq.join(" → ");
        const wrong = shuffle(rng, seq.slice()).reverse().join(" → ");
        return mcq({
          id: qid(meta, "cu-orden-"+seq[0]),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: "¿Cuál es el orden correcto de los sucesos?",
          correct,
          distractors: [wrong, shuffle(rng, seq.slice()).join(" → "), "No hay orden"],
          explanation: "Orden de sucesos = lo que pasa primero, después y al final."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genEspanolTeatro(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "t1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "En una obra de teatro, ¿qué es un diálogo?",
        correct: "Lo que dicen los personajes",
        distractors: ["Un dibujo", "Una suma", "Una receta"],
        explanation: "Diálogo = lo que hablan los personajes."
      }),
      () => mcq({
        id: qid(meta, "t2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué signos usamos para preguntas?",
        correct: "¿ ?",
        distractors: ["¡ !", ":", "."],
        explanation: "Preguntas: ¿ ?"
      }),
      () => mcq({
        id: qid(meta, "t3"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué signos usamos para exclamaciones?",
        correct: "¡ !",
        distractors: ["¿ ?", ":", "."],
        explanation: "Exclamaciones: ¡ !"
      }),
      () => mcq({
        id: qid(meta, "t4"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué signo son los dos puntos?",
        correct: ":",
        distractors: ["¿ ?", "¡ !", "."],
        explanation: "Dos puntos = :"
      }),
      () => {
        const ex = pick(rng, [
          {p:"Un dragón que habla", c:"ficticio"},
          {p:"Un niño real en la escuela", c:"real"},
          {p:"Un robot mágico", c:"ficticio"},
          {p:"Una maestra que da clase", c:"real"}
        ]);
        return mcq({
          id: qid(meta, "t-real-"+ex.c),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `“${ex.p}” es un personaje…`,
          correct: ex.c,
          distractors: ["real","ficticio"].filter(x=>x!==ex.c),
          explanation: "Real = existe; ficticio = inventado."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  /* ---------- Generators: Matemáticas ---------- */
  function genMatNumeros150(rng, meta){
    const templates = [
      () => {
        const n = rInt(rng, 1, 149);
        return mcq({
          id: qid(meta, "nxt-"+n),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Qué número va después de ${n}?`,
          correct: String(n+1),
          distractors: [String(n-1), String(n+2), String(n+10)],
          explanation: "Después = sumar 1."
        });
      },
      () => {
        const n = rInt(rng, 2, 150);
        return mcq({
          id: qid(meta, "prev-"+n),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Qué número va antes de ${n}?`,
          correct: String(n-1),
          distractors: [String(n+1), String(n-2), String(n-10)],
          explanation: "Antes = restar 1."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genMatEscritura100(rng, meta){
    const templates = [
      () => {
        const n = rInt(rng, 1, 100);
        return mcq({
          id: qid(meta, "num-"+n),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `Selecciona el número: ${n}`,
          correct: String(n),
          distractors: shuffle(rng, [String(n+1), String(Math.max(1,n-1)), String(rInt(rng,1,100))]).slice(0,3),
          explanation: "Lee con calma el número."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genMatFiguras(rng, meta){
    const figs = [
      {name:"círculo", props:"es redondo", wrong:["rombo","rectángulo","paralelogramo"]},
      {name:"rectángulo", props:"parece una puerta", wrong:["círculo","rombo","óvalo"]},
      {name:"cuadrado", props:"tiene 4 lados iguales", wrong:["rectángulo","óvalo","rombo"]},
      {name:"óvalo", props:"parece un huevo", wrong:["círculo","rectángulo","rombo"]},
      {name:"paralelogramo", props:"parece un rectángulo inclinado", wrong:["círculo","óvalo","cuadrado"]},
      {name:"rombo", props:"parece un diamante", wrong:["círculo","rectángulo","cuadrado"]}
    ];
    const templates = [
      () => {
        const f = pick(rng, figs);
        return mcq({
          id: qid(meta, "fig-"+f.name),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Cuál figura ${f.props}?`,
          correct: f.name,
          distractors: shuffle(rng, f.wrong).slice(0,3),
          explanation: `La figura correcta es ${f.name}.`
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genMatTangram(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "tg1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Cuántas piezas tiene el tangram clásico?",
        correct: "7",
        distractors: ["5","6","8"],
        explanation: "El tangram clásico usa 7 piezas."
      }),
      () => mcq({
        id: qid(meta, "tg2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿De dónde es originario el tangram?",
        correct: "China",
        distractors: ["México","España","Canadá"],
        explanation: "El tangram es un rompecabezas originario de China."
      })
    ];
    return build40(rng, templates, meta);
  }

  function genMatVerticesLados(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "vl1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Un vértice es…",
        correct: "Una esquina",
        distractors: ["Un color", "Un sonido", "Una fruta"],
        explanation: "Vértice = esquina (donde se juntan lados)."
      }),
      () => {
        const ex = pick(rng, [
          {shape:"círculo", correct:"lados curvos"},
          {shape:"óvalo", correct:"lados curvos"},
          {shape:"cuadrado", correct:"lados rectos"},
          {shape:"rectángulo", correct:"lados rectos"}
        ]);
        return mcq({
          id: qid(meta, "vl2-"+ex.shape),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `La figura ${ex.shape} tiene…`,
          correct: ex.correct,
          distractors: ["vértices infinitos", "solo un lado", ex.correct === "lados curvos" ? "lados rectos" : "lados curvos"],
          explanation: "Círculo/óvalo tienen curvas; cuadrado/rectángulo tienen lados rectos."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genMatAgrupacion(rng, meta){
    const templates = [
      () => {
        const total = pick(rng, [20,30,40,50,60]);
        const g = pick(rng, [2,5,10]);
        const groups = total / g;
        return mcq({
          id: qid(meta, "ag-"+total+"-"+g),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `Si tengo ${total} objetos y los agrupo de ${g} en ${g}, ¿cuántos grupos hago?`,
          correct: String(groups),
          distractors: shuffle(rng, [String(groups-1), String(groups+1), String(g)]).slice(0,3),
          explanation: `${total} ÷ ${g} = ${groups}.`
        });
      },
      () => mcq({
        id: qid(meta, "ag2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Cuál grupo suele ser más grande?",
        correct: "Agrupar de 10 en 10",
        distractors: ["Agrupar de 2 en 2", "Agrupar de 5 en 5", "Agrupar de 1 en 1"],
        explanation: "De 10 en 10 forma grupos más grandes."
      })
    ];
    return build40(rng, templates, meta);
  }

  function genMatMedidas(rng, meta){
    const templates = [
      () => {
        const a = pick(rng, ["lápiz", "regla", "cuerda", "popote"]);
        return mcq({
          id: qid(meta, "med-"+a),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `Si un ${a} A mide más que un ${a} B, ¿cuál es más largo?`,
          correct: "A",
          distractors: ["B", "Los dos", "Ninguno"],
          explanation: "Más largo = el que mide más."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genMatUnidadesDecenas(rng, meta){
    const templates = [
      () => {
        const n = rInt(rng, 10, 99);
        const d = Math.floor(n/10);
        return mcq({
          id: qid(meta, "dec-"+n),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `En el número ${n}, ¿cuántas decenas hay?`,
          correct: String(d),
          distractors: shuffle(rng, [String(n%10), String(n), String(Math.max(0,d-1))]).slice(0,3),
          explanation: `${n} = ${d} decenas y ${n%10} unidades.`
        });
      },
      () => {
        const n = rInt(rng, 10, 99);
        const u = n%10;
        return mcq({
          id: qid(meta, "uni-"+n),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `En el número ${n}, ¿cuántas unidades hay?`,
          correct: String(u),
          distractors: shuffle(rng, [String(Math.floor(n/10)), String(n), String((u+1)%10)]).slice(0,3),
          explanation: `${n} = ${Math.floor(n/10)} decenas y ${u} unidades.`
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genMatRectaNumerica(rng, meta){
    const templates = [
      () => {
        const start = rInt(rng, 0, 20);
        const step = rInt(rng, 1, 10);
        const op = pick(rng, ["+", "-"]);
        const correct = op === "+" ? start + step : Math.max(0, start - step);
        return mcq({
          id: qid(meta, "rn-"+start+op+step),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `En la recta numérica: si estás en ${start} y ${op === "+" ? "avanzas" : "retrocedes"} ${step}, llegas a…`,
          correct: String(correct),
          distractors: shuffle(rng, [String(correct+1), String(Math.max(0,correct-1)), String(start)]).slice(0,3),
          explanation: op === "+" ? "Avanzar = sumar." : "Retroceder = restar."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genMatDescompAditiva(rng, meta){
    const templates = [
      () => {
        const n = rInt(rng, 10, 99);
        const d = Math.floor(n/10)*10;
        const u = n%10;
        return mcq({
          id: qid(meta, "da-"+n),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Cuál es una descomposición aditiva de ${n}?`,
          correct: `${d} + ${u}`,
          distractors: [`${d-10} + ${u+10}`, `${u} + ${d}`, `${n} + 0`].slice(0,3),
          explanation: "Descomponer = separar en decenas y unidades."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genMatProblemas(rng, meta){
    const templates = [
      () => {
        const a = rInt(rng, 1, 20);
        const b = rInt(rng, 1, 20);
        const op = pick(rng, ["+", "-"]);
        const correct = op === "+" ? a + b : Math.max(0, a - b);
        const story = op === "+"
          ? `Tenías ${a} canicas y te dieron ${b}. ¿Cuántas tienes ahora?`
          : `Tenías ${a} galletas y te comiste ${b}. ¿Cuántas quedan?`;
        return mcq({
          id: qid(meta, "pb-"+a+op+b),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: story,
          correct: String(correct),
          distractors: shuffle(rng, [String(correct+1), String(Math.max(0,correct-1)), String(a), String(b)]).slice(0,3),
          explanation: op === "+" ? "Sumar = juntar." : "Restar = quitar."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genMatDiasSemana(rng, meta){
    const days = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];
    const templates = [
      () => {
        const i = rInt(rng, 0, days.length-1);
        const askNext = rng() < 0.5;
        const day = days[i];
        const correct = askNext ? days[(i+1)%7] : days[(i-1+7)%7];
        return mcq({
          id: qid(meta, "ds-"+day+(askNext?"n":"p")),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: askNext ? `¿Qué día va después de ${day}?` : `¿Qué día va antes de ${day}?`,
          correct,
          distractors: shuffle(rng, days.filter(d=>d!==correct)).slice(0,3),
          explanation: "Recuerda el orden de la semana."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genMatAyerHoyManana(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "ahm1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Si hoy es miércoles, mañana será…",
        correct: "jueves",
        distractors: ["martes","viernes","domingo"],
        explanation: "Mañana es el día siguiente."
      }),
      () => mcq({
        id: qid(meta, "ahm2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Si hoy es lunes, ayer fue…",
        correct: "domingo",
        distractors: ["sábado","martes","jueves"],
        explanation: "Ayer es el día anterior."
      })
    ];
    return build40(rng, templates, meta);
  }

  function genMatPeso(rng, meta){
    const templates = [
      () => {
        const a = pick(rng, ["pluma", "hoja", "algodón"]);
        const b = pick(rng, ["piedra", "libro", "botella llena"]);
        return mcq({
          id: qid(meta, "peso-"+a+"-"+b),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Qué es más pesado?`,
          correct: b,
          distractors: shuffle(rng, [a, "los dos pesan igual", "ninguno pesa"]).slice(0,3),
          explanation: "Pesado = cuesta más levantarlo."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  /* ---------- Generators: Inglés ---------- */
  function genInglesColors(rng, meta){
    const templates = [
      () => {
        const it = pick(rng, EN.colors);
        const correct = it.en;
        const wrong = shuffle(rng, EN.colors.filter(x=>x.en!==correct).map(x=>x.en)).slice(0,3);
        return mcq({
          id: qid(meta, "c-es-"+it.es),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Cómo se dice "${it.es}" en inglés?`,
          correct,
          distractors: wrong,
          explanation: `"${it.es}" = "${it.en}".`
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genInglesColorsGrammar(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "g1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: `Completa: "What color ___ it?"`,
        correct: "is",
        distractors: ["are","am","be"],
        explanation: "Para it (singular) usamos is."
      }),
      () => mcq({
        id: qid(meta, "g2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: `Completa: "What color ___ they?"`,
        correct: "are",
        distractors: ["is","am","be"],
        explanation: "Para they (plural) usamos are."
      }),
      () => mcq({
        id: qid(meta, "g3"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: `Respuesta correcta: "It ___ green."`,
        correct: "is",
        distractors: ["are","am","be"],
        explanation: "It is (It's) = singular."
      }),
      () => mcq({
        id: qid(meta, "g4"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: `Respuesta correcta: "They ___ blue."`,
        correct: "are",
        distractors: ["is","am","be"],
        explanation: "They are (They're) = plural."
      })
    ];
    return build40(rng, templates, meta);
  }

  function genInglesFamily(rng, meta){
    const templates = [
      () => {
        const it = pick(rng, EN.family);
        const correct = it.en;
        const wrong = shuffle(rng, EN.family.filter(x=>x.en!==correct).map(x=>x.en)).slice(0,3);
        return mcq({
          id: qid(meta, "fam-"+it.es),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Cómo se dice "${it.es}" en inglés?`,
          correct,
          distractors: wrong,
          explanation: `"${it.es}" = "${it.en}".`
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genInglesAlphabet(rng, meta){
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const templates = [
      () => {
        const i = rInt(rng, 0, letters.length-2);
        return mcq({
          id: qid(meta, "az-next-"+letters[i]),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Qué letra va después de "${letters[i]}"?`,
          correct: letters[i+1],
          distractors: [letters[Math.max(0,i-1)], letters[i+2], letters[rInt(rng,0,25)]],
          explanation: "Recuerda el orden del alfabeto."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genInglesThisThat(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "tt1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: `Completa: "___ is my mom." (cerca)`,
        correct: "This",
        distractors: ["That","These","Those"],
        explanation: "This = cerca."
      }),
      () => mcq({
        id: qid(meta, "tt2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: `Completa: "___ is my dad." (lejos)`,
        correct: "That",
        distractors: ["This","These","Those"],
        explanation: "That = lejos."
      }),
      () => mcq({
        id: qid(meta, "tt3"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: `Pregunta correcta: "___ is this?"`,
        correct: "Who",
        distractors: ["What","Where","When"],
        explanation: "Who = quién."
      })
    ];
    return build40(rng, templates, meta);
  }

  function genInglesSnacks(rng, meta){
    const templates = [
      () => {
        const it = pick(rng, EN.snacks);
        const correct = it.en;
        const wrong = shuffle(rng, EN.snacks.filter(x=>x.en!==correct).map(x=>x.en)).slice(0,3);
        return mcq({
          id: qid(meta, "sn-"+it.es),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Cómo se dice "${it.es}" en inglés?`,
          correct,
          distractors: wrong,
          explanation: `"${it.es}" = "${it.en}".`
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genInglesThereIsAre(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "tia1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Para UNA cosa usamos…",
        correct: "There is",
        distractors: ["There are","This is","They are"],
        explanation: "Singular: There is."
      }),
      () => mcq({
        id: qid(meta, "tia2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Para MUCHAS cosas usamos…",
        correct: "There are",
        distractors: ["There is","This is","They is"],
        explanation: "Plural: There are."
      })
    ];
    return build40(rng, templates, meta);
  }

  /* ---------- Generators: Ética ---------- */
  function genEticaBiotico(rng, meta){
    const biotic = ["planta","árbol","perro","gato","mariposa"];
    const abiotic = ["agua","aire","roca","luz del sol","tierra"];
    const templates = [
      () => {
        const askBiotic = rng() < 0.5;
        const correct = askBiotic ? pick(rng, biotic) : pick(rng, abiotic);
        const distractors = askBiotic ? shuffle(rng, abiotic).slice(0,3) : shuffle(rng, biotic).slice(0,3);
        return mcq({
          id: qid(meta, "bio-"+(askBiotic?"b":"a")+"-"+correct),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: askBiotic ? "¿Cuál es un factor biótico?" : "¿Cuál es un factor abiótico?",
          correct,
          distractors,
          explanation: askBiotic ? "Biótico = ser vivo." : "Abiótico = no vivo."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genEticaPlantas(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "pl1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Una planta con flores tiene…",
        correct: "flores",
        distractors: ["huesos", "ruedas", "pantalla"],
        explanation: "Con flores = produce flores."
      }),
      () => mcq({
        id: qid(meta, "pl2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Una planta con frutos produce…",
        correct: "frutos (como manzana, mango, etc.)",
        distractors: ["solo piedras", "solo aire", "solo luz"],
        explanation: "Con frutos = produce frutos."
      })
    ];
    return build40(rng, templates, meta);
  }

  function genEticaEntornos(rng, meta){
    const env = ["bosque","selva","desierto","playa","montaña"];
    const templates = [
      () => {
        const e = pick(rng, env);
        return mcq({
          id: qid(meta, "en-"+e),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: `¿Cuál es un entorno natural?`,
          correct: e,
          distractors: shuffle(rng, ["cine","supermercado","casa","escuela"]).slice(0,3),
          explanation: "Entorno natural = lugar de la naturaleza."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genEticaAnimales(rng, meta){
    const noct = ["búho","murciélago"];
    const diur = ["mariposa","abeja"];
    const inver = ["lombriz","caracol","mariposa"];
    const templates = [
      () => {
        const askNoct = rng() < 0.5;
        const correct = askNoct ? pick(rng, noct) : pick(rng, diur);
        return mcq({
          id: qid(meta, "ani-"+(askNoct?"n":"d")+"-"+correct),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: askNoct ? "¿Cuál es un animal nocturno?" : "¿Cuál es un animal diurno?",
          correct,
          distractors: askNoct ? shuffle(rng, diur).slice(0,3) : shuffle(rng, noct).slice(0,3),
          explanation: askNoct ? "Nocturno = activo de noche." : "Diurno = activo de día."
        });
      },
      () => {
        const correct = pick(rng, inver);
        return mcq({
          id: qid(meta, "sin-h-"+correct),
          subject: meta.subject, itemId: meta.itemId, topic: meta.title,
          prompt: "¿Cuál es un animal sin huesos (invertebrado)?",
          correct,
          distractors: shuffle(rng, ["perro","gato","pollo"]).slice(0,3),
          explanation: "Invertebrado = sin huesos."
        });
      }
    ];
    return build40(rng, templates, meta);
  }

  function genEticaMovimientos(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "mov1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Rodar significa…",
        correct: "moverse dando vueltas",
        distractors: ["quedarse quieto", "cambiar de color", "crecer hojas"],
        explanation: "Rodar = dar vueltas."
      }),
      () => mcq({
        id: qid(meta, "mov2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Girar significa…",
        correct: "dar vuelta sobre un punto",
        distractors: ["saltar", "aplastar", "leer"],
        explanation: "Girar = dar vuelta."
      }),
      () => mcq({
        id: qid(meta, "mov3"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Deslizar significa…",
        correct: "moverse resbalando",
        distractors: ["romperse", "gritar", "dormir"],
        explanation: "Deslizar = resbalar."
      })
    ];
    return build40(rng, templates, meta);
  }

  function genEticaEmpujarJalar(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "ej1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Empujar significa…",
        correct: "alejar algo de ti",
        distractors: ["traer algo hacia ti","girar","rodar"],
        explanation: "Empujar = alejar."
      }),
      () => mcq({
        id: qid(meta, "ej2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Jalar significa…",
        correct: "traer algo hacia ti",
        distractors: ["alejar algo de ti","saltar","aplastar"],
        explanation: "Jalar = traer."
      })
    ];
    return build40(rng, templates, meta);
  }

  function genEticaRespeto(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "rs1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Cuál acción muestra respeto a los seres vivos?",
        correct: "Cuidar plantas y animales",
        distractors: ["Patear plantas", "Tirar basura al río", "Molestar animales"],
        explanation: "Respeto = cuidar y no lastimar."
      })
    ];
    return build40(rng, templates, meta);
  }

  function genEticaRecursos(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "re1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "Un recurso natural puede ser…",
        correct: "agua",
        distractors: ["videojuego", "televisión", "plástico"],
        explanation: "Recurso natural = viene de la naturaleza."
      }),
      () => mcq({
        id: qid(meta, "re2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Para qué usamos el agua en la vida diaria?",
        correct: "para beber, lavar y cocinar",
        distractors: ["para volar", "para prender pantallas", "para cambiar colores"],
        explanation: "El agua se usa en muchas actividades diarias."
      })
    ];
    return build40(rng, templates, meta);
  }

  function genEticaCuidado(rng, meta){
    const templates = [
      () => mcq({
        id: qid(meta, "cu1"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué ayuda a cuidar tu entorno?",
        correct: "Recoger basura",
        distractors: ["Tirar basura al piso", "Romper plantas", "Ensuciar el agua"],
        explanation: "Cuidar = mantener limpio y respetar."
      }),
      () => mcq({
        id: qid(meta, "cu2"),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: "¿Qué es reciclar?",
        correct: "Separar y volver a usar materiales",
        distractors: ["Romper cosas", "Tirar todo junto", "Pintar paredes"],
        explanation: "Reciclar = volver a usar materiales."
      })
    ];
    return build40(rng, templates, meta);
  }

  /* ---------- Build 40 helper ---------- */
  function qid(meta, suffix){
    return `${meta.subject}|${meta.itemId}|${suffix}`;
  }

  function build40(rng, templates, meta){
    const out = [];
    let guard = 0;
    while (out.length < 40 && guard < 2000){
      guard++;
      const q = pick(rng, templates)();
      // ensure unique ids
      if (!out.some(x => x.id === q.id)) out.push(q);
    }
    // if templates were too few, pad with slight variations
    while (out.length < 40){
      const n = out.length + 1;
      out.push(mcq({
        id: qid(meta, "pad-"+n),
        subject: meta.subject, itemId: meta.itemId, topic: meta.title,
        prompt: `Pregunta extra de práctica (${n}): ¿Cuál opción es correcta?`,
        correct: "La correcta",
        distractors: ["La incorrecta", "Otra incorrecta", "Ninguna"],
        explanation: "Pregunta de relleno: aumenta banco luego si quieres."
      }));
    }
    return out;
  }

  /* =========================================================
     Session building
  ========================================================== */

  const ITEMS_BY_SUBJECT = groupBySubject(ITEMS);

  function groupBySubject(items){
    const m = {};
    items.forEach(it => {
      if (!m[it.subject]) m[it.subject] = [];
      m[it.subject].push(it);
    });
    return m;
  }

  function getItemById(itemId){
    return ITEMS.find(i => i.id === itemId) || null;
  }

  function generateItemQuestions(itemObj){
    const rng = makeRng(itemObj.id);
    const meta = { subject: itemObj.subject, itemId: itemObj.id, title: itemObj.title };
    return itemObj.gen(rng, meta);
  }

  // cache for speed
  const ITEM_Q_CACHE = new Map(); // itemId -> 40 questions

  function get40ForItem(itemId){
    if (ITEM_Q_CACHE.has(itemId)) return ITEM_Q_CACHE.get(itemId);
    const itemObj = getItemById(itemId);
    if (!itemObj) return [];
    const q40 = generateItemQuestions(itemObj);
    ITEM_Q_CACHE.set(itemId, q40);
    return q40;
  }

  function buildSession({ subject, itemId, total, difficulty, shuffleOn }){
    // difficulty influences option count/distractors via add-ons:
    // For MVP we keep same 3–4 options; in "normal" we add one distractor where possible.
    // (Simple but effective.)

    let pool = [];

    if (subject === "Mixto" || itemId === "mixed"){
      // Mix across all items
      const allItems = ITEMS.slice();
      const rng = makeRng("mixed-session");
      const order = shuffleOn ? shuffle(rng, allItems) : allItems;
      // pull from items round-robin until reach total (without duplicates)
      const used = new Set();
      let idx = 0;
      while (pool.length < total && idx < 10000){
        idx++;
        const it = order[(idx-1) % order.length];
        const q40 = get40ForItem(it.id);
        const rngQ = makeRng(`mix|${it.id}|${idx}`);
        const q = pick(rngQ, q40);
        if (!used.has(q.id)){
          used.add(q.id);
          pool.push(adjustDifficulty(q, difficulty));
        }
      }
      if (shuffleOn) pool = shuffle(makeRng("mix-shuf"), pool);
      return pool.slice(0, total);
    }

    // Single item
    const q40 = get40ForItem(itemId).map(q => adjustDifficulty(q, difficulty));
    pool = shuffleOn ? shuffle(makeRng(itemId + "|session"), q40) : q40.slice();
    return pool.slice(0, total);
  }

  function adjustDifficulty(q, difficulty){
    if (difficulty !== "normal") return q;
    // add one plausible distractor when options are only 3
    if (q.options.length >= 4) return q;

    const extra = "No estoy seguro";
    if (!q.options.includes(extra)){
      const rng = makeRng(q.id + "|diff");
      const opts = q.options.slice();
      opts.push(extra);
      const shuffled = shuffle(rng, opts);
      const answerIndex = shuffled.indexOf(q.options[q.answerIndex]);
      return { ...q, options: shuffled, answerIndex };
    }
    return q;
  }

  /* =========================================================
     UI: Home items list
  ========================================================== */

  function renderItems(subject){
    itemsList.innerHTML = "";
    if (!subject || subject === "Mixto"){
      itemsHint.textContent = "En Mixto se combinan ítems de todas las materias.";
      return;
    }
    const list = ITEMS_BY_SUBJECT[subject] || [];
    itemsHint.textContent = `Selecciona un ítem de ${subject}. (Cada ítem tiene hasta 40 preguntas)`;

    list.forEach(it => {
      const b = document.createElement("button");
      b.className = "itemBtn";
      b.innerHTML = `
        <span>${escapeHtml(it.title)}</span>
        <span class="itemTag">40</span>
      `;
      b.addEventListener("click", () => startSession(subject, it.id));
      itemsList.appendChild(b);
    });
  }

  /* =========================================================
     Quiz rendering
  ========================================================== */

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
      ? "Tip papás: si falla, revelen y expliquen en 1 frase."
      : (state.mode === "practice" ? "Tip: En práctica te avisa al momento." : "Tip: En examen, resultados al final.");
  }

  function renderQuestion(){
    const q = state.questions[state.index];
    state.locked = false;
    nextBtn.disabled = true;

    pillProgress.textContent = `${state.index+1}/${state.total}`;
    pillSubject.textContent = state.subject;
    const itemTitle = state.itemId === "mixed" ? "Mixto (varios ítems)" : (getItemById(state.itemId)?.title || "Ítem");
    pillItem.textContent = itemTitle.length > 20 ? (itemTitle.slice(0, 20) + "…") : itemTitle;

    topicLine.textContent = `Ítem: ${itemTitle}`;
    promptEl.textContent = q.prompt;

    feedbackEl.classList.add("hidden");
    feedbackEl.classList.remove("ok","bad");
    feedbackEl.textContent = "";

    optionsEl.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "optionBtn";
      btn.textContent = opt;
      btn.addEventListener("click", () => choose(idx));
      optionsEl.appendChild(btn);
    });

    setParentsHelp(state.parentsHelp);
  }

  function choose(chosenIndex){
    if (state.locked) return;
    state.locked = true;

    const q = state.questions[state.index];
    const correct = chosenIndex === q.answerIndex;

    state.answers.push({ qid: q.id, chosenIndex, correct });

    const btns = Array.from(optionsEl.querySelectorAll("button"));
    btns.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answerIndex) b.classList.add("correct");
      if (i === chosenIndex && i !== q.answerIndex) b.classList.add("wrong");
    });

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
    if (state.index < state.questions.length - 1){
      state.index++;
      renderQuestion();
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
      if (!a.correct && state.parentsHelp){
        li.innerHTML += `<br><span style="color:#0a7a36; font-weight:900;">Correcta: "${escapeHtml(q.options[q.answerIndex])}"</span>`;
        if (q.explanation) li.innerHTML += `<br><span class="muted">💡 ${escapeHtml(q.explanation)}</span>`;
      }
      ul.appendChild(li);
    });

    reviewEl.appendChild(ul);
  }

  /* =========================================================
     Session start
  ========================================================== */

  function startSession(subject, itemId){
    state.subject = subject;
    state.itemId = itemId || "mixed";
    state.total = parseInt(questionCount.value, 10);
    state.mode = sessionMode.value;
    state.difficulty = difficultySel.value;
    state.shuffle = shuffleSel.value === "yes";

    state.lastSessionConfig = {
      subject: state.subject,
      itemId: state.itemId,
      total: state.total,
      mode: state.mode,
      difficulty: state.difficulty,
      shuffle: state.shuffle
    };

    state.index = 0;
    state.answers = [];

    // Build questions (no repeats)
    state.questions = buildSession({
      subject: state.subject,
      itemId: state.itemId,
      total: state.total,
      difficulty: state.difficulty,
      shuffleOn: state.shuffle
    });

    showScreen("quiz");
    renderQuestion();
  }

  /* =========================================================
     Events / init
  ========================================================== */

  parentsToggleBtn.addEventListener("click", () => setParentsHelp(!state.parentsHelp));
  qsa(".tile").forEach(btn => btn.addEventListener("click", () => renderItems(btn.dataset.subject)));

  startMixedBtn.addEventListener("click", () => startSession("Mixto", "mixed"));

  homeBtn1.addEventListener("click", () => showScreen("home"));
  homeBtn2.addEventListener("click", () => showScreen("home"));

  revealBtn.addEventListener("click", revealAnswer);
  nextBtn.addEventListener("click", next);

  retryBtn.addEventListener("click", () => {
    if (!state.lastSessionConfig) return showScreen("home");
    const c = state.lastSessionConfig;
    // re-run same session config
    state.subject = c.subject;
    state.itemId = c.itemId;
    questionCount.value = String(c.total);
    sessionMode.value = c.mode;
    difficultySel.value = c.difficulty;
    shuffleSel.value = c.shuffle ? "yes" : "no";
    startSession(c.subject, c.itemId);
  });

  newBtn.addEventListener("click", () => showScreen("home"));

  // Home defaults
  setParentsHelp(false);
  renderItems(null);
  showScreen("home");

  /* ---------- small helper ---------- */
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

})();
