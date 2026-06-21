const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const qrRoutes = require('./routes/qrRoutes');
const passport = require('passport'); // outh2 google
const session = require('express-session');
require('./config/passport-setup');
const userRoutes = require("./routes/userRoutes");
const authRoutes = require('./routes/authRoutes');
const sonCreationRoutes = require("./routes/sonCreationRoutes");
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT; // Puedes usar cualquier puerto libre
const activityRoutes = require('./routes/activityRoutes');


//rutas:

const fatherRoutes = require('./routes/fatherRoutes');
const sonMainRoutes = require('./routes/sonMainRoutes');
const shopRoutes = require('./routes/shopRoutes');

// Middleware
app.use(cors()); // Permite peticiones desde el frontend de RN
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(cookieParser());

app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/crear', userRoutes); //para crear un usuario administrador
app.use('/api/auth', authRoutes); //crear un usuario con google o iniciar sesion con google
app.use('/crearHijo', sonCreationRoutes); //crear un usuario hijo
app.use('/api/activities', activityRoutes);
app.use('/fatherMain', sonCreationRoutes);

app.use('/api/father', fatherRoutes);
app.use('/api/son-home', sonMainRoutes);

app.use('/api/qr', qrRoutes);
app.use('/api/shop', shopRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});

