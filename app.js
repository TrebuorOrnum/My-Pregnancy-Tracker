/* ---------- language ---------- */
let lang = localStorage.getItem("lang") || "en";
function setLang(l) {
  localStorage.setItem("lang", l);
  location.reload();
}

/* ---------- tabs ---------- */
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

window.onload = () => {
  showTab('tracker');
  loadAppointments();
  loadKicks();
  loadFavorites();
};

/* ---------- pregnancy data ---------- */
const weeks = {
  6: { size: "Lentil", info: "Baby's heart begins beating." },
  8: { size: "Kidney Bean", info: "Arms and legs are forming." },
  12: { size: "Plum", info: "Baby can move and swallow." },
  16: { size: "Avocado", info: "Skeleton strengthening." },
  20: { size: "Banana", info: "Halfway there!" },
  24: { size: "Corn", info: "Sleep cycles begin." },
  28: { size: "Eggplant", info: "Brain growing fast." },
  32: { size: "Squash", info: "Practicing breathing." },
  36: { size: "Lettuce", info: "Almost full term." },
  40: { size: "Pumpkin", info: "Ready for birth!" }
};

/* ---------- pregnancy calculator ---------- */
function calculate() {
  const lmp = new Date(document.getElementById("lmpDate").value);
  if (!lmp) return;

  const today = new Date();
  const days = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
  const week = Math.floor(days / 7);

  const due = new Date(lmp);
  due.setDate(due.getDate() + 280);

  let trimester = week <= 12 ? "1st Trimester" : week <= 27 ? "2nd Trimester" : "3rd Trimester";

  document.getElementById("weekText").innerText = "Week " + week;
  document.getElementById("trimesterText").innerText = trimester;
  document.getElementById("dueDate").innerText =
    (lang === "af" ? "Verwagte sperdatum: " : "Estimated Due Date: ") + due.toDateString();

  document.getElementById("progressFill").style.width = Math.min((days / 280) * 100, 100) + "%";

  let nearest = Object.keys(weeks).reduce((a, b) => Math.abs(b - week) < Math.abs(a - week) ? b : a);
  let data = weeks[nearest];

  document.getElementById("sizeText").innerText = "Baby is about the size of a " + data.size;
  document.getElementById("infoText").innerText = data.info;

  partnerMessage(week);
  drawBaby(week);
}

/* ---------- baby drawing ---------- */
function drawBaby(week) {
  const ctx = document.getElementById("babyCanvas").getContext("2d");
  ctx.clearRect(0, 0, 260, 260);
  let scale = Math.min(week * 3, 120);

  ctx.fillStyle = "#f8bbd0";
  ctx.beginPath();
  ctx.arc(130, 130, scale / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(130, 90, scale / 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(115, 85, 3, 0, Math.PI * 2);
  ctx.arc(145, 85, 3, 0, Math.PI * 2);
  ctx.fill();
}

/* ---------- kick counter ---------- */
function loadKicks() {
  const today = new Date().toDateString();
  let data = JSON.parse(localStorage.getItem("kicks") || "{}");
  document.getElementById("kickCount").innerText = (data[today] || 0) + " kicks today";
}

function addKick() {
  const today = new Date().toDateString();
  let data = JSON.parse(localStorage.getItem("kicks") || "{}");
  data[today] = (data[today] || 0) + 1;
  localStorage.setItem("kicks", JSON.stringify(data));
  loadKicks();
}

function resetKicks() {
  localStorage.removeItem("kicks");
  loadKicks();
}

/* ---------- contraction timer ---------- */
let startTime, lastContraction = 0, timerInt;

function startContraction() {
  startTime = Date.now();
  timerInt = setInterval(() => {
    let d = Math.floor((Date.now() - startTime) / 1000);
    let m = String(Math.floor(d / 60)).padStart(2, '0');
    let s = String(d % 60).padStart(2, '0');
    document.getElementById("timer").innerText = m + ":" + s;
  }, 1000);
}

function stopContraction() {
  clearInterval(timerInt);
  let now = Date.now();
  if (lastContraction) {
    let gap = Math.floor((now - lastContraction) / 60000);
    document.getElementById("interval").innerText = "Interval: " + gap + " minutes";
  }
  lastContraction = now;
}

/* ---------- appointments ---------- */
function loadAppointments() {
  let list = document.getElementById("apptList");
  list.innerHTML = "";
  let appts = JSON.parse(localStorage.getItem("appointments") || "[]");
  appts.forEach(a => {
    let li = document.createElement("li");
    li.innerText = a.date + " - " + a.note;
    list.appendChild(li);
  });
}

function addAppointment() {
  let date = document.getElementById("apptDate").value;
  let note = document.getElementById("apptNote").value;
  let appts = JSON.parse(localStorage.getItem("appointments") || "[]");
  appts.push({ date, note });
  localStorage.setItem("appointments", JSON.stringify(appts));
  loadAppointments();
}

/* ---------- partner mode ---------- */
function partnerMessage(week) {
  const msgs = [
    "Help with chores this week.",
    "Attend clinic visit together.",
    "Talk to the baby!",
    "Prepare hospital bag.",
    "Encourage and support mom."
  ];
  document.getElementById("partnerText").innerText = msgs[week % msgs.length];
}

/* ---------- notifications ---------- */
async function enableNotifications() {
  if (!("Notification" in window)) return;
  let perm = await Notification.requestPermission();
  if (perm === "granted") {
    setInterval(() => new Notification("Pregnancy Update ❤️", {
      body: "Check this week's baby development!"
    }), 86400000);
  }
}

/* ---------------- BABY NAME DATABASE ---------------- */
const nameDatabase = {
  "Liam": "Strong-willed warrior",
  "Noah": "Rest, comfort",
  "Elijah": "My God is Yahweh",
  "James": "Supplanter",
  "Lucas": "Bringer of light",
  "Daniel": "God is my judge",
  "Ethan": "Firm, strong",
  "Leo": "Lion",
  "David": "Beloved",
  "Mateo": "Gift of God",
  "Caleb": "Faithful, devoted",
  "Nathan": "He gave",
  "Ryan": "Little king",
  "Joshua": "God is salvation",
  "Aaron": "Exalted, strong",
  "Adrian": "From the sea",
  "Micah": "Who is like God?",
  "Samuel": "God has heard",
  "Isaac": "Laughter",
  "Ezra": "Helper",

  "Olivia": "Olive tree, peace",
  "Emma": "Whole, universal",
  "Ava": "Life, birdlike",
  "Mia": "Mine, beloved",
  "Sophia": "Wisdom",
  "Isabella": "God is my oath",
  "Amelia": "Industrious",
  "Charlotte": "Free woman",
  "Grace": "Elegance, kindness",
  "Hannah": "Favor, grace",
  "Leah": "Weary or delicate",
  "Zoe": "Life",
  "Lily": "Purity",
  "Sarah": "Princess",
  "Naomi": "Pleasantness",
  "Chloe": "Blooming",
  "Abigail": "Father's joy",
  "Eliana": "God has answered",
  "Eva": "Life",
  "Nora": "Light"
};

const boyNames = Object.keys(nameDatabase).slice(0, 20);
const girlNames = Object.keys(nameDatabase).slice(20);

/* ---------------- NAME COMBINER ---------------- */
function combineNames(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  let part1 = a.substring(0, Math.ceil(a.length / 2));
  let part2 = b.substring(Math.floor(b.length / 2));
  let combo = part1 + part2;
  return combo.charAt(0).toUpperCase() + combo.slice(1);
}

/* ---------------- GENERATOR ---------------- */
function generateNames() {
  const mom = document.getElementById("momName").value.trim();
  const dad = document.getElementById("dadName").value.trim();
  const gender = document.getElementById("gender").value;
  const list = document.getElementById("nameResults");
  list.innerHTML = "";

  let pool = [];
  if (gender === "boy") pool = boyNames;
  else if (gender === "girl") pool = girlNames;
  else pool = boyNames.concat(girlNames);

  if (mom && dad) {
    let combo = combineNames(mom, dad);
    showName(combo, "A special blended name from the parents ❤️");
  }

  for (let i = 0; i < 6; i++) {
    let name = pool[Math.floor(Math.random() * pool.length)];
    let meaning = nameDatabase[name] || "Beautiful baby name";
    showName(name, meaning);
  }

  loadFavorites();
}

/* ---------------- DISPLAY ---------------- */
function showName(name, meaning) {
  const list = document.getElementById("nameResults");
  let li = document.createElement("li");
  li.innerHTML = `<b>${name}</b><br><small>${meaning}</small><br>
                  <button onclick="saveFavorite('${name}')">Save ❤️</button>`;
  list.appendChild(li);
}

/* ---------------- FAVORITES STORAGE ---------------- */
function saveFavorite(name) {
  let fav = JSON.parse(localStorage.getItem("favNames") || "[]");
  if (!fav.includes(name)) {
    fav.push(name);
    localStorage.setItem("favNames", JSON.stringify(fav));
  }
  loadFavorites();
}

function loadFavorites() {
  const list = document.getElementById("favNames");
  list.innerHTML = "";
  let fav = JSON.parse(localStorage.getItem("favNames") || "[]");
  fav.forEach(n => {
    let meaning = nameDatabase[n] || "Saved baby name";
    let li = document.createElement("li");
    li.innerHTML = `<b>${n}</b><br><small>${meaning}</small><br>
                    <button onclick="removeFavorite('${n}')">Remove ❌</button>`;
    list.appendChild(li);
  });
}

function removeFavorite(name) {
  let fav = JSON.parse(localStorage.getItem("favNames") || "[]");
  fav = fav.filter(n => n !== name);
  localStorage.setItem("favNames", JSON.stringify(fav));
  loadFavorites();
}

/* ---------- service worker registration ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}