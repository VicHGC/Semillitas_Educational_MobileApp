const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); // importo esto para hacer un json web token y hacer la sesion persisntente
const modelDB = require('../modelsBD/accountModel');
const axios = require('axios'); // <--- ¡IMPORTANTE! Asegúrate de instalarlo: npm install axios

// --------------------------------------------------------------------------
// RUTAS WEB (Passport estándar)
// Útiles si tienes una versión web en React.js normal, pero no para la App Móvil
// --------------------------------------------------------------------------

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']})); 

router.get('/google/callback', passport.authenticate('google'), async (req, res) => {
  try{
    const user = req.user;

    const accessToken = jwt.sign(
      {"userID": user.id},
      process.env.JWT_ACCESS_SECRET,
      {expiresIn: '15m'}
    );

    const refreshToken = jwt.sign(
      {"userID": user.id},
      process.env.JWT_REFRESH_SECRET,
      {expiresIn: '7d'}
    );

    await modelDB.updateUserRefreshToken(user.id, refreshToken);

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // NOTA: Esta respuesta JSON se queda en el navegador, por eso no servía para la App
    res.status(200).json({
      message: "Login con Google exitoso",
      accessToken: accessToken,
      userID: user.id
    });
  } catch (error){
    console.error("Error en el callback de Google: ", error);
    res.status(500).send("Error interno del servidor");
  }
});


// --------------------------------------------------------------------------
// RUTA MÓVIL (Canje manual con Axios)
// Esta es la que usará tu App de React Native
// --------------------------------------------------------------------------

router.post('/google/mobile', async (req, res) => {
  // 1. Solo pedimos el 'code'. Ya no exigimos redirectUri.
  const { code } = req.body;

  if (!code) {
      return res.status(400).json({ message: "Falta el código de autorización" });
  }

  try {
    // 2. Intercambiamos el código por tokens
    // IMPORTANTE: No enviamos 'redirect_uri' en este objeto.
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,     // El del Web
      client_secret: process.env.GOOGLE_CLIENT_SECRET, // El Secreto del Web
      grant_type: 'authorization_code'
      // ¡redirect_uri ELIMINADO!
    });

    const { access_token } = tokenResponse.data;

    // 3. Obtener datos del usuario
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    // ... (El resto de tu lógica de base de datos se queda IGUAL) ...
    const googleUser = userInfoResponse.data;
    const email = googleUser.email;
    const googleID = googleUser.id;
    const displayName = googleUser.name;

    let user = await modelDB.findUserByEmail(email);
    if (user) {
      if (!user.google_id) {
        await modelDB.updateUserGoogleId(user.id, googleID);
      }
    } else {
      user = await modelDB.createGoogleUser(email, googleID, displayName);
    }

    const appAccessToken = jwt.sign(
      { "userID": user.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const appRefreshToken = jwt.sign(
      { "userID": user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await modelDB.updateUserRefreshToken(user.id, appRefreshToken);

    res.status(200).json({
      message: "Login Móvil Exitoso",
      accessToken: appAccessToken,
      refreshToken: appRefreshToken,
      userID: user.id
    });

  } catch (error) {
    console.error("❌ Error en Auth Móvil:", error.response?.data || error.message);
    res.status(400).json({ 
        message: "Error al autenticar con Google", 
        details: error.response?.data 
    });
  }
});

// --------------------------------------------------------------------------
// REFRESH TOKEN - Genera nuevo access token usando refresh token
// --------------------------------------------------------------------------

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "Refresh token requerido" });
  }
  
  try {
    // 1. Verificar el refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userID;
    
    // 2. Verificar que el refresh token coincida con el de la base de datos
    const user = await modelDB.findUserById(userId);
    
    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token inválido" });
    }
    
    // 3. Generar nuevo access token
    const newAccessToken = jwt.sign(
      { userID: userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );
    
    // 4. (Opcional) Rotar refresh token - generar uno nuevo
    const newRefreshToken = jwt.sign(
      { userID: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    // 5. Guardar el nuevo refresh token
    await modelDB.updateUserRefreshToken(userId, newRefreshToken);
    
    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
    
  } catch (error) {
    console.error("Error en refresh token:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Refresh token expirado" });
    }
    
    res.status(401).json({ success: false, message: "Refresh token inválido" });
  }
});

module.exports = router;
