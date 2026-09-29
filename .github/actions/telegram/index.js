// Evitar aviso de deprecación de la libreria node-telegram-bot-api
process.env.NTBA_FIX_319 = 1;

const core = require('@actions/core');
const TelegramBot = require('node-telegram-bot-api');

async function run() {
  try {
    // Variables de entorno (secretos de GitHub)
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Nombre que se pasa desde el workflow
    const nombre = core.getInput('nombre');

    if (!token || !chatId) {
      throw new Error('Faltan las variables de entorno TELEGRAM_TOKEN o TELEGRAM_CHAT_ID');
    }

    const bot = new TelegramBot(token, { polling: false });

    const mensaje = 'Workflow ejecutado correctamente después del último commit. Saludos ${nombre}.';

    await bot.sendMessage(chatId, mensaje);

    // Respuesta de la acción
    console.log('Mensaje enviado');
    core.setOutput('respuesta', 'Mensaje enviado');
  } catch (error) {
    core.setFailed('Error al enviar el mensaje: ${error.message}');
  }
}

run();
