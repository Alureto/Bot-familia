const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// Para mantener el servidor despierto
app.get('/', (req, res) => {
  res.send('¡El servidor de mi familia está vivo y corriendo! 🚀');
});
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor web encendido');
});

// === TU BOT ===
const token = '8555058312:AAH_O4KyBfJRnZS3B1qzwlpDdqSKxeWidHo'; // ¡Pon tu token aquí!
const bot = new TelegramBot(token, {polling: true});

// 1. El comando inicial
bot.onText(/\/registro/, (msg) => {
  const chatId = msg.chat.id;
  const opciones = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Caminata', callback_data: 'tipo_Caminata' }, { text: 'Barras', callback_data: 'tipo_Barras' }],
        [{ text: 'Cardio / Zumba', callback_data: 'tipo_Cardio' }, { text: 'Descanso', callback_data: 'Descanso' }]
      ]
    }
  };
  bot.sendMessage(chatId, '¿Qué ejercicio completaste hoy?', opciones);
});

// 2. Lo que pasa cuando tocan un botón
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const usuario = query.from.first_name;
  const data = query.data;

  // Si presionan Descanso, se acaba ahí
  if (data === 'Descanso') {
    bot.sendMessage(chatId, `✅ ${usuario} se tomó un merecido día de descanso hoy. ¡Mañana con todo!`);
    return;
  }

  // Si eligen un ejercicio (ej. "tipo_Barras"), les pregunta el tiempo
  if (data.startsWith('tipo_')) {
    const ejercicio = data.split('_')[1]; // Extrae la palabra "Barras"
    const opcionesTiempo = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '15 min', callback_data: `tiempo_15_${ejercicio}` }, { text: '30 min', callback_data: `tiempo_30_${ejercicio}` }],
          [{ text: '45 min', callback_data: `tiempo_45_${ejercicio}` }, { text: '60+ min', callback_data: `tiempo_60_${ejercicio}` }]
        ]
      }
    };
    bot.sendMessage(chatId, `¿Cuánto tiempo hiciste de ${ejercicio}?`, opcionesTiempo);
  }

  // Si eligen el tiempo (ej. "tiempo_30_Barras"), manda el mensaje final
  if (data.startsWith('tiempo_')) {
    const partes = data.split('_');
    const minutos = partes[1];
    const ejercicio = partes[2];

    bot.sendMessage(chatId, `🔥 ¡${usuario} completó su sesión de ${ejercicio} por ${minutos} minutos! Si quieres, manda una foto de tu evidencia 📸.`);
  }
});
