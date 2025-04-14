const translations = {
  en: {
    title: "Bar Code",
    timeLabel: "Date & Time:",
    product: "Product",
    price: "Price",
    notFound: "Product not found",
    products: "Load products",
  },
  es: {
    title: "Código de Barras",
    timeLabel: "Fecha y Hora:",
    product: "Producto",
    price: "Precio",
    notFound: "Producto no encontrado",
    products: "Cargar productos",
  },
};

const products = [];
let currentLang = "en";
const productsSpanish = [];
let timerInterval = null;
let code = "";

function readProductsFromJSON(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const json = JSON.parse(event.target.result);

    products.length = 0;

    for (const product of json) {
      const { id, name, price, image } = product;
      products.push([id.toString(), name.trim(), price.trim(), image.trim()]);
    }
  };

  reader.readAsText(file);
}

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
  document.getElementById("products").textContent = t.products;
}

function search(code) {
  const barcodeContainer = document.querySelector(".barcode-container");
  let content = "";
  let found = false;

  for (const product of products) {
    if (product[0] === code) {
      content = `
        <h2>${translations[currentLang].product}: ${product[1]}</h2>
        <p>${translations[currentLang].price}: ${product[2]}</p>
        <img src="./img/${product[3]}" alt="${product[1]}" class="product-image">
      `;
      found = true;
      break;
    }
  }

  if (!found) {
    content = `<p class="error">${translations[currentLang].notFound}</p>`;
  }

  barcodeContainer.innerHTML = content;

  setTimeout(() => {
    barcodeContainer.innerHTML = `
      <img src="./img/barcode.gif" alt="Barcode" class="barcode">
      <h2 id="barcode-title">${translations[currentLang].title}</h2>
    `;
  }, 3000);
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      readProductsFromJSON(file);
    }
  });

  const savedLang = localStorage.getItem("toggleState");
  const savedMode = localStorage.getItem("darkmode");

  if (savedLang === "unchecked") {
    currentLang = "en";
  }

  if (savedMode === "active") {
    document.body.classList.add("darkmode");
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      code += event.key;
    } else {
      search(code);
      code = "";
    }
  });

  applyLanguage();
  startClock();
});
