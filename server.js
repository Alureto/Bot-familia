const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// 1. EL TRUCO: Un mini servidor web para que no se duerma
app.get('/', (req, res) => {
  res.send('¡El servidor de mi familia está vivo y corriendo! 🚀');
});
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor web encendido');
});

// 2. EL BOT: Tu código original
const token = '8555058312:AAH_O4KyBfJRnZS3B1qzwlpDdqSKxeWidHo'; 
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/registro/, (msg) => {
  const chatId = msg.chat.id;
  const opciones = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Caminata', callback_data: 'Caminata' }, { text: 'Barras', callback_data: 'Barras' }],
        [{ text: 'Cardio / Zumba', callback_data: 'Cardio' }, { text: 'Tocó descanso', callback_data: 'Descanso' }]
      ]
    }
  };
  bot.sendMessage(chatId, '¿Qué ejercicio completaste hoy?', opciones);
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const usuario = query.from.first_name;
  const ejercicio = query.data;

  if (ejercicio === 'Descanso') {
    bot.sendMessage(chatId, `✅ ${usuario} se tomó un merecido día de descanso hoy. ¡Mañana con todo!`);
  } else {
    bot.sendMessage(chatId, `🔥 ¡${usuario} completó su sesión de ${ejercicio}! Si quieres, manda una foto de tu evidencia 📸.`);
  }
});
