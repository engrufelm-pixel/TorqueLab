import express from "express";

const app = express();
const port = process.env.PORT || 3000;
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

app.use(express.json());
app.use(express.static("."));

app.post("/api/telegram-lead", async (req, res) => {
  if (!botToken || !chatId) {
    return res.status(500).json({ ok: false, error: "Telegram env vars are not configured" });
  }

  const { name, phone, car, urgency, message } = req.body;
  const text = [
    "Новая заявка с сайта TorqueLab",
    "",
    `Имя: ${name || "-"}`,
    `Телефон: ${phone || "-"}`,
    `Авто / услуга: ${car || "-"}`,
    `Срочность: ${urgency || "-"}`,
    `Комментарий: ${message || "-"}`
  ].join("\n");

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text
    })
  });

  if (!telegramResponse.ok) {
    return res.status(502).json({ ok: false, error: "Telegram API request failed" });
  }

  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`TorqueLab template is running at http://localhost:${port}`);
});
