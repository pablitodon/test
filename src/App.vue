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
import { ref, computed, onMounted } from "vue";

const billAmount = ref(0);
const tipPercent = ref(15);

const tipAmount = computed(() => {
  return ((billAmount.value * tipPercent.value) / 100).toFixed(2);
});

const totalAmount = computed(() => {
  return (Number(billAmount.value) + Number(tipAmount.value)).toFixed(2);
});

// Форматирование числа с разделением тысяч
const formatNumber = (num) => {
  return parseFloat(num).toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Отправка данных в Telegram
const sendDataToTelegram = async () => {
  const data = {
    bill: billAmount.value,
    tip: tipAmount.value,
    total: totalAmount.value,
  };

  if (window.Telegram?.WebApp) {
    // Получаем данные о пользователе из Telegram
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const chatId = user?.id; // ID чата с пользователем

    if (chatId) {
      try {
        // Отправляем сообщение через Bot API
        await fetch(
          `https://api.telegram.org/bot${YOUR_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: `💸 Результаты:\nСчёт: ${data.bill} ₽\nЧаевые: ${data.tip} ₽\nИтого: ${data.total} ₽`,
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

        window.Telegram.WebApp.close();
      } catch (error) {
        console.error("Ошибка отправки:", error);
      }
    }
  } else {
    alert(JSON.stringify(data, null, 2));
  }
};

onMounted(() => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.BackButton.onClick(() => {
      window.Telegram.WebApp.close();
    });

    // Можно также установить заголовок
    window.Telegram.WebApp.setHeaderColor("#0088cc");
    window.Telegram.WebApp.MainButton.setParams({
      text: "Отправить результаты",
      is_visible: true,
    }).onClick(sendDataToTelegram);
  }
});
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
