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

// Отправка данных в Telegram
const sendDataToTelegram = () => {
  const data = {
    bill: billAmount.value,
    tip: tipAmount.value,
    total: totalAmount.value,
  };

  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify(data));
    window.Telegram.WebApp.close();
  } else {
    alert("Данные для отправки: " + JSON.stringify(data));
  }
};

// Инициализация Telegram WebApp
onMounted(() => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.expand(); // Раскрыть на весь экран
    window.Telegram.WebApp.BackButton.show(); // Показать кнопку "Назад"
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
