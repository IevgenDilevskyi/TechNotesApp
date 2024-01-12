require ('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger)

app.use(cors(corsOptions)); // enable cors

app.use(express.json()); // for parsing requests in json format

app.use(cookieParser()); // for parsing cookies

app.use('/', express.static(path.join(__dirname, 'public'))); // serve static files from public folder when hitting / route

app.use('/', require('./routes/root')); // use routes/root.js for / route

app.use('/users', require('./routes/userRoutes')); // use routes/userRoutes.js for /users route
app.use('/auth', require('./routes/authRoutes')); // use routes/authRoutes.js for /users route
app.use('/notes', require('./routes/noteRoutes')); // use routes/noteRoutes.js for /note route

app.all('*', (req,res) =>{ // catch all routes that are not defined
  res.status(404)
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if(req.accepts('json')){
    res.json({message: '404 Not Found'})
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)}); 
})

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})

