const TELEGRAM_ENDPOINT = "/api/telegram-lead";

const services = [
  ["Компьютерная диагностика", "от 1 500 ₽", "Ошибки, датчики, чек-лист рекомендаций"],
  ["ТО и замена масла", "от 3 900 ₽", "Масло, фильтры, осмотр подвески"],
  ["Ремонт подвески", "от 4 500 ₽", "Диагностика, запчасти, гарантия"],
  ["Тормозная система", "от 3 200 ₽", "Колодки, диски, жидкость, суппорты"],
  ["Шиномонтаж", "от 2 800 ₽", "Балансировка и сезонное хранение"],
  ["Детейлинг кузова", "от 9 900 ₽", "Полировка, химия, защитные составы"]
];

const servicesGrid = document.querySelector(".services-grid");
const form = document.querySelector(".lead-form");
const statusNode = document.querySelector(".form-status");
const submitButton = document.querySelector(".submit-button");
const menuToggle = document.querySelector(".menu-toggle");
const mobilePanel = document.querySelector(".mobile-panel");

servicesGrid.innerHTML = services
  .map(
    ([title, price, note]) => `
      <article class="group border border-white/10 bg-night/70 p-6 transition hover:-translate-y-1 hover:border-neon/60 hover:shadow-neon">
        <div class="mb-7 h-1 w-14 bg-gradient-to-r from-neon to-ember"></div>
        <h3 class="text-xl font-bold">${title}</h3>
        <p class="mt-3 min-h-12 text-sm leading-6 text-white/55">${note}</p>
        <div class="mt-7 flex items-center justify-between gap-4">
          <strong class="text-2xl font-black text-white">${price}</strong>
          <a class="rounded-md border border-white/10 px-4 py-2 text-sm font-bold text-neon transition group-hover:border-neon" href="#lead">Расчет</a>
        </div>
      </article>
    `
  )
  .join("");

function setStatus(message, type = "info") {
  statusNode.textContent = message;
  statusNode.classList.remove("hidden", "text-red-300", "text-emerald-300", "text-white/60");
  const className = type === "error" ? "text-red-300" : type === "success" ? "text-emerald-300" : "text-white/60";
  statusNode.classList.add(className);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const payload = Object.fromEntries(new FormData(form).entries());
  submitButton.disabled = true;
  submitButton.textContent = "Отправляем...";
  setStatus("Заявка уходит администратору в Telegram.");

  try {
    const response = await fetch(TELEGRAM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Telegram endpoint returned an error");
    }

    form.reset();
    setStatus("Готово. Заявка отправлена, менеджер скоро свяжется.", "success");
  } catch (error) {
    setStatus("Не получилось отправить заявку. Проверьте backend endpoint и токен Telegram.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Отправить в Telegram";
  }
});

menuToggle?.addEventListener("click", () => {
  const isOpen = !mobilePanel.classList.contains("hidden");
  mobilePanel.classList.toggle("hidden", isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
});

document.querySelectorAll(".mobile-panel a").forEach((link) => {
  link.addEventListener("click", () => mobilePanel.classList.add("hidden"));
});
