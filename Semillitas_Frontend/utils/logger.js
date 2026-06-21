/**
 * Sistema de Logs Mejorado para Semillitas
 * Niveles: debug, info, warn, error
 * Incluye contexto adicional para debugging
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Configuración global - cambiar a INFO en producción
const CURRENT_LEVEL = LOG_LEVELS.DEBUG;

/**
 * Obtiene el contexto actual de la aplicación
 * @returns {Object} Contexto con timestamp y origen
 */
const getContext = () => ({
  timestamp: new Date().toISOString(),
  platform: 'React Native',
});

/**
 * Formatea el mensaje con emojis según el nivel
 */
const formatMessage = (level, tag, message, data) => {
  const emojis = {
    DEBUG: '🔍',
    INFO: 'ℹ️',
    WARN: '⚠️',
    ERROR: '❌',
    SUCCESS: '✅',
    GAME: '🎮',
    API: '🌐',
    AUTH: '🔐',
    SHOP: '🛒',
    ACTIVITY: '📚',
  };

  const emoji = emojis[tag] || '📝';
  const prefix = `[${emoji} ${tag || 'LOG'}]`;

  if (data) {
    return `${prefix} ${message} %c%o`;
  }
  return `${prefix} ${message}`;
};

/**
 * Función principal de logging
 */
const log = (level, tag, message, data = null) => {
  if (level < CURRENT_LEVEL) return;

  const formattedMessage = formatMessage(level, tag, message, data);

  switch (level) {
    case LOG_LEVELS.DEBUG:
      console.debug(formattedMessage, 'color: #9E9E9E; font-style: italic;', data || '');
      break;
    case LOG_LEVELS.INFO:
      console.log(formattedMessage, 'color: #2196F3;', data || '');
      break;
    case LOG_LEVELS.WARN:
      console.warn(formattedMessage, 'color: #FF9800; font-weight: bold;', data || '');
      break;
    case LOG_LEVELS.ERROR:
      console.error(formattedMessage, 'color: #F44336; font-weight: bold;', data || '');
      break;
    default:
      console.log(formattedMessage);
  }
};

// API pública
const logger = {
  debug: (tag, message, data) => log(LOG_LEVELS.DEBUG, tag, message, data),
  info: (tag, message, data) => log(LOG_LEVELS.INFO, tag, message, data),
  warn: (tag, message, data) => log(LOG_LEVELS.WARN, tag, message, data),
  error: (tag, message, data) => log(LOG_LEVELS.ERROR, tag, message, data),

  // Métodos de conveniencia para áreas específicas
  api: (message, data) => log(LOG_LEVELS.INFO, 'API', message, data),
  auth: (message, data) => log(LOG_LEVELS.INFO, 'AUTH', message, data),
  game: (message, data) => log(LOG_LEVELS.INFO, 'GAME', message, data),
  shop: (message, data) => log(LOG_LEVELS.INFO, 'SHOP', message, data),
  activity: (message, data) => log(LOG_LEVELS.INFO, 'ACTIVITY', message, data),

  // Errores específicos
  apiError: (message, error) => log(LOG_LEVELS.ERROR, 'API', message, {
    message: error?.message,
    status: error?.response?.status,
    data: error?.response?.data,
  }),
  networkError: (error) => log(LOG_LEVELS.ERROR, 'NETWORK', 'Error de red', {
    message: error?.message,
    code: error?.code,
  }),

  // Success logging
  success: (tag, message) => {
    console.log(`✅ [${tag}] ${message}`);
  },
};

export default logger;
export { LOG_LEVELS };