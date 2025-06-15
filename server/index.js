const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
require('./config/passport');

// Connect DB
// mongoose.connect('process.env.MONGO_URI/');

// Connect DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});




app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// JSON parser
app.use(express.json());

// Session middleware
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
// }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/unsplash', require('./routes/unsplash'));
app.use('/upload', require('./routes/upload'));

app.get('/auth/me', (req, res) => {
  if (req.user) return res.json(req.user);
  res.status(401).json({ error: 'Unauthorized' });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
