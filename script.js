// === DANE QUIZU ===
const quizData = [
  { question: "Jakie było pierwsze zastosowanie komercyjne druku 3D w latach 80.?", options: ["Zabawki dla dzieci", "Prototypy dentystyczne i biżuteria", "Części samochodowe", "Broń palna"], correct: 1 },
  { question: "Co NASA planuje wydrukować na Marsie?", options: ["Flagi", "Bazy i schronienia dla astronautów", "Pojazdy marsjańskie", "Jedzenie dla kolonistów"], correct: 1 },
  { question: "Ile czasu zajęło wydrukowanie pierwszego domu 3D?", options: ["24 godziny", "7 dni", "3 miesiące", "Rok"], correct: 0 },
  { question: "Co wydrukowano w kosmosie jako pierwszy obiekt 3D poza Ziemią?", options: ["Narzędzie - klucz nasadowy", "Figurkę astronauty", "Część rakiety", "Kubek do kawy"], correct: 0 },
  { question: "Który znany projektant mody wydrukował kolekcję ubrań 3D?", options: ["Coco Chanel", "Iris van Herpen", "Giorgio Armani", "Ralph Lauren"], correct: 1 },
  { question: "Co wydrukowano dla Zoo w San Diego aby uratować gatunki?", options: ["Sztuczne jajka dla ptaków", "Sztuczne gniazda", "Protezy dla rannych zwierząt", "Koralowce dla ratowania raf koralowych"], correct: 3 },
  { question: "Jaki instrument muzyczny został wydrukowany i brzmi jak prawdziwy?", options: ["Fortepian", "Gitara akustyczna", "Bębny", "Flet"], correct: 1 },
  { question: "Jaki wzór infill jest najszybszy do wydrukowania?", options: ["Honeycomb (plaster miodu)", "Grid (siatka)", "Gyroid", "Lines (linie proste)"], correct: 3 },
  { question: "Co lekarze wydrukowali w 3D przed skomplikowaną operacją serca dziecka?", options: ["Nowe serce", "Narzędzia chirurgiczne", "Model serca pacjenta do przećwiczenia operacji", "Protezy"], correct: 2 },
  { question: "Która z tych rzeczy ZOSTAŁA NAPRAWDĘ WYDRUKOWANA NA DRUKARCE 3D?", options: ["Most dla pieszych w Amsterdamie (ze stali)", "Modele serc dzieci do planowania operacji", "Działający pistolet", "Wszystkie powyższe"], correct: 3 },
  { question: "Jakie jedzenie można wydrukować na drukarce 3D?", options: ["Tylko formy do ciasta", "Czekoladę, pizzę i mięso hodowane z komórek", "Tylko lody", "Nie da się drukować jedzenia"], correct: 1 },
  { question: "Co zostało wydrukowane dla armii USA?", options: ["Baraki mieszkalne wzniesione w 40 godzin", "Czołgi", "Samoloty", "Mundury"], correct: 0 },
  { question: "Kto otrzymał wydrukowaną protezę ręki za mniej niż 50 dolarów?", options: ["Celebryci w Hollywood", "Dzieci w krajach rozwijających się", "Sportowcy olimpijscy", "Astronauci"], correct: 1 }
];

// === ELEMENTY ===
const screens = { start: document.getElementById('start-screen'), quiz: document.getElementById('quiz-screen'), result: document.getElementById('result-screen'), reward: document.getElementById('reward-screen') };
const elements = { startBtn: document.getElementById('start-btn'), nextBtn: document.getElementById('next-btn'), restartBtn: document.getElementById('restart-btn'), backBtn: document.getElementById('back-to-result-btn'), question: document.getElementById('question'), options: document.getElementById('options'), progressBar: document.getElementById('progress-bar'), currentQ: document.getElementById('current-q'), totalQ: document.getElementById('total-q'), scoreText: document.getElementById('score-text'), resultMessage: document.getElementById('result-message'), circleProgress: document.getElementById('circle-progress') };

// === DŹWIĘKI ===
const sounds = { click: document.getElementById('sound-click'), select: document.getElementById('sound-select'), next: document.getElementById('sound-next'), result: document.getElementById('sound-result'), reward: document.getElementById('sound-reward') };
function playSound(sound) { sound.currentTime = 0; sound.play().catch(() => {}); }

// === ZMIENNE ===
let currentQuestion = 0, score = 0, selectedOption = null;

// === START ===
elements.startBtn.addEventListener('click', () => { playSound(sounds.click); showScreen('quiz'); setTimeout(loadQuestion, 300); });

// === ŁADOWANIE PYTANIA ===
function loadQuestion() {
  const q = quizData[currentQuestion];
  elements.question.textContent = q.question;
  elements.currentQ.textContent = currentQuestion + 1;
  elements.totalQ.textContent = quizData.length;
  elements.progressBar.style.width = (currentQuestion / quizData.length) * 100 + '%';
  elements.options.innerHTML = '';
  q.options.forEach((option, i) => {
    const btn = document.createElement('div');
    btn.classList.add('option');
    btn.textContent = option;
    btn.addEventListener('click', () => selectOption(btn, i, q.correct));
    elements.options.appendChild(btn);
  });
  elements.nextBtn.disabled = true;
  selectedOption = null;
}

// === WYBÓR ===
function selectOption(btn, index, correct) {
  if (selectedOption !== null) return;
  selectedOption = index;
  playSound(sounds.select);
  btn.classList.add('selected');
  setTimeout(() => {
    document.querySelectorAll('.option').forEach((opt, i) => {
      if (i === correct) opt.classList.add('correct');
      else if (i === index && index !== correct) opt.classList.add('incorrect');
      opt.style.pointerEvents = 'none';
    });
    if (index === correct) score++;
    elements.nextBtn.disabled = false;
  }, 400);
}

// === DALEJ ===
elements.nextBtn.addEventListener('click', () => { playSound(sounds.next); currentQuestion++; currentQuestion < quizData.length ? loadQuestion() : showResult(); });

// === WYNIK ===
function showResult() {
  const percentage = Math.round((score / quizData.length) * 100);
  elements.scoreText.textContent = percentage + '%';
  elements.circleProgress.style.strokeDasharray = `${percentage}, 100`;
  if (percentage >= 80) {
    setTimeout(() => { playSound(sounds.reward); showScreen('reward'); }, 1200);
  } else {
    playSound(sounds.result);
    elements.resultMessage.textContent = percentage >= 70 ? "Świetny wynik! Jesteś na dobrej drodze!" : percentage >= 50 ? "Nieźle! Druk 3D to przyszłość." : "Czas nauczyć się więcej o druku 3D!";
    setTimeout(() => showScreen('result'), 300);
  }
}

// === PRZEŁĄCZANIE EKRANÓW ===
function showScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  setTimeout(() => screens[screenName].classList.add('active'), 50);
}

// === RESTART ===
elements.restartBtn.addEventListener('click', () => { playSound(sounds.click); currentQuestion = 0; score = 0; setTimeout(() => showScreen('start'), 200); });
elements.backBtn.addEventListener('click', () => { playSound(sounds.click); showScreen('result'); });

// === GRADIENT SVG ===
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'gradient');
  ['#8a2be2', '#64c8ff'].forEach((color, i) => {
    const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop.setAttribute('offset', i === 0 ? '0%' : '100%');
    stop.setAttribute('stop-color', color);
    gradient.appendChild(stop);
  });
  defs.appendChild(gradient);
  svg.appendChild(defs);
  document.body.appendChild(svg);
});