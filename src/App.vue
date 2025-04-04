<template>
  <div class="container">
    <h1>Калькулятор чаевых</h1>

    <div class="input-group">
      <label>Сумма счёта:</label>
      <input type="number" v-model="billAmount" placeholder="Введите сумму" />
    </div>

    <div class="input-group">
      <label>Процент чаевых:</label>
      <select v-model="tipPercent">
        <option value="10">10%</option>
        <option value="15">15%</option>
        <option value="20">20%</option>
      </select>
    </div>

    <div class="result">
      <p>
        Чаевые: <strong>{{ tipAmount }} ₽</strong>
      </p>
      <p>
        Итого: <strong>{{ totalAmount }} ₽</strong>
      </p>
    </div>

    <button @click="sendDataToTelegram" class="tg-button">
      Отправить в Telegram
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const billAmount = ref(0);
const tipPercent = ref("15");
const customTipPercent = ref("");

// Вычисляемые значения
const currentTipPercent = computed(() => {
  return tipPercent.value === "custom"
    ? parseFloat(customTipPercent.value || 0)
    : parseFloat(tipPercent.value);
});

const tipAmount = computed(() => {
  return (billAmount.value * currentTipPercent.value) / 100;
});

const totalAmount = computed(() => {
  return Number(billAmount.value) + Number(tipAmount.value);
});

// Форматирование для вывода
const formattedTipAmount = computed(() => {
  return tipAmount.value.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

const formattedTotalAmount = computed(() => {
  return totalAmount.value.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

// ⚠️ Опасный момент - токен в открытом коде!
const BOT_TOKEN = "AAH0yHNPsNcIJ18WayXM3wbbNblNrA9T5A4";

// Отправка данных
const sendDataToTelegram = async () => {
  if (!billAmount.value || billAmount.value <= 0) {
    alert("Введите корректную сумму счёта");
    return;
  }

  // Минимальная защита - проверяем, что вызов из Telegram
  if (!window.Telegram?.WebApp?.initData) {
    alert("Функция доступна только в Telegram!");
    return;
  }

  const user = window.Telegram.WebApp.initDataUnsafe?.user;
  if (!user?.id) {
    alert("Не удалось получить данные пользователя");
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: user.id,
          text: `💸 Результаты:\nСчёт: ${formattedTotalAmount.value} ₽\nЧаевые: ${formattedTipAmount.value} ₽ (${currentTipPercent.value}%)\nИтого: ${formattedTotalAmount.value} ₽`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Рассчитать снова",
                  web_app: { url: window.location.href },
                },
              ],
            ],
          },
        }),
      }
    );

    if (!response.ok) throw new Error("Ошибка отправки");

    window.Telegram.WebApp.close();
  } catch (error) {
    console.error("Ошибка:", error);
    window.Telegram.WebApp.showAlert(`Ошибка: ${error.message}`);
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.result {
  margin: 20px 0;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 5px;
}

.tg-button {
  width: 100%;
  padding: 12px;
  background: #0088cc;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.tg-button:hover {
  background: #0077b3;
}
</style>
