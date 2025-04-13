const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const kaspiMerchantId = 'YOUR_KASPI_MERCHANT_ID';  // Заменить на свой
const kaspiSecretKey = 'YOUR_KASPI_SECRET_KEY';    // Заменить на свой

// Маршрут для создания платежа
app.post('/create-payment', async (req, res) => {
  const { amount, orderId, accountId } = req.body;

  try {
    const paymentRequest = {
      merchant_id: kaspiMerchantId,
      order_id: orderId,
      amount: amount,
      account_id: accountId,
      return_url: 'https://your-site.com/return-url',  // URL для возврата после оплаты
    };

    // Отправляем запрос на создание платежа в Kaspi
    const response = await axios.post('https://api.kaspi.kz/payment/create', paymentRequest, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${kaspiSecretKey}`,
      },
    });

    res.json(response.data);  // Ответ от Kaspi (ссылка на оплату и т.д.)
  } catch (error) {
    console.error('Ошибка при создании платежа:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для проверки статуса платежа
app.post('/check-payment', async (req, res) => {
  const { orderId } = req.body;

  try {
    const response = await axios.post('https://api.kaspi.kz/payment/status', {
      order_id: orderId,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${kaspiSecretKey}`,
      },
    });

    res.json(response.data);  // Статус платежа (успешно или нет)
  } catch (error) {
    console.error('Ошибка при проверке статуса:', error);
    res.status(500).send('Ошибка сервера');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
