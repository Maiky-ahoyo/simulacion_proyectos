const productsSpanish = [
  ["1", "Granola", "$ 34.00", "granola.jpg"],
  ["2", "Batido de Proteína", "$ 60.00", "protein_shake.png"],
  ["3", "Tortitas de Arroz", "$ 28.00", "rice_cakes.jpg"],
  ["4", "Mezcla de Nueces", "$ 45.00", "trail_mix.avif"],
  ["5", "Batido de Fruta", "$ 55.00", "smoothie.jpg"],
  ["6", "Chips de Verdura", "$ 38.00", "veggie_chips.webp"],
  ["7", "Copa de Fruta", "$ 42.00", "fruit_cup.png"],
  ["8", "Hummus", "$ 40.00", "hummus.jpg"],
  ["9", "Yogur Griego", "$ 48.00", "greek_yogurt.jpg"],
  ["10", "Almendras", "$ 50.00", "almonds.jpg"],
];

const productsEnglish = [
  ["1", "Granola", "$ 1.95", "granola.jpg"],
  ["2", "Protein Shake", "$ 3.45", "protein_shake.png"],
  ["3", "Rice Cakes", "$ 1.60", "rice_cakes.jpg"],
  ["4", "Trail Mix", "$ 2.60", "trail_mix.avif"],
  ["5", "Smoothie", "$ 3.15", "smoothie.jpg"],
  ["6", "Veggie Chips", "$ 2.20", "veggie_chips.webp"],
  ["7", "Fruit Cup", "$ 2.40", "fruit_cup.png"],
  ["8", "Hummus", "$ 2.30", "hummus.jpg"],
  ["9", "Greek Yogurt", "$ 2.75", "greek_yogurt.jpg"],
  ["10", "Almonds", "$ 2.85", "almonds.jpg"],
];

const translations = {
  en: {
    title: "Bar Code",
    timeLabel: "Date & Time:",
    product: "Product",
    price: "Price",
    notFound: "Product not found",
  },
  es: {
    title: "Código de Barras",
    timeLabel: "Fecha y Hora:",
    product: "Producto",
    price: "Precio",
    notFound: "Producto no encontrado",
  },
};

let currentLang = "en";
let currentProducts = productsEnglish;
let timerInterval = null;
let code = "";

function startClock() {
  const timeElement = document.getElementById("date-time");
  updateTime(timeElement);
  timerInterval = setInterval(() => updateTime(timeElement), 1000);
}

function updateTime(element) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const now = new Date().toLocaleDateString(
    currentLang === "en" ? "en-US" : "es-ES",
    options
  );
  element.textContent = `${translations[currentLang].timeLabel} ${now}`;
}

function toggleLanguaje() {
  currentLang = currentLang === "en" ? "es" : "en";
  currentProducts = currentLang === "en" ? productsEnglish : productsSpanish;
  localStorage.setItem(
    "toggleState",
    currentLang === "en" ? "checked" : "unchecked"
  );
  applyLanguage();
}

function toggleDarkMode() {
  document.body.classList.toggle("darkmode");
  localStorage.setItem(
    "darkmode",
    document.body.classList.contains("darkmode") ? "active" : null
  );
}

function applyLanguage() {
  const t = translations[currentLang];

  document.getElementById("barcode-title").textContent = t.title;
  document.querySelector("#time-display h3").textContent = t.timeLabel;
}

function buscar(code) {
  const barcodeContainer = document.querySelector(".barcode-container");
  let contenido = "";
  let encontrado = false;

  for (const producto of currentProducts) {
    if (producto[0] === code) {
      contenido = `
        <h2>${translations[currentLang].product}: ${producto[1]}</h2>
        <p>${translations[currentLang].price}: ${producto[2]}</p>
        <img src="./img/${producto[3]}" alt="${producto[1]}" class="product-image">
      `;
      encontrado = true;
      break;
    }
  }

  if (!encontrado) {
    contenido = `<p class="error">${translations[currentLang].notFound}</p>`;
  }

  barcodeContainer.innerHTML = contenido;

  setTimeout(() => {
    barcodeContainer.innerHTML = `
      <img src="./img/barcode.gif" alt="Barcode" class="barcode">
      <h2 id="barcode-title">${translations[currentLang].title}</h2>
    `;
  }, 3000);
}

window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("toggleState");
  const savedMode = localStorage.getItem("darkmode");

  if (savedLang === "unchecked") {
    currentLang = "en";
    currentProducts = productsEnglish;
  }

  if (savedMode === "active") {
    document.body.classList.add("darkmode");
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      code += event.key;
    } else {
      buscar(code);
      code = "";
    }
  });

  applyLanguage();
  startClock();
});
