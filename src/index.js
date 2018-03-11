const express = require("express");
const morgan = require("morgan");
const winston = require("winston");
const app = express();


const options = {
    file: {
      filename: "application.log",
      colorize: false,
      json: true,
      handleExceptions: true,
      level: "info"
    },
    console: {
      colorize: true,
      json: false,
      handleExceptions: true,
      level: "debug"
    }
}

// Define transports logging in winston.
let logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false,
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};

// Enable module morgan.
app.use(morgan("combined", { stream: logger.stream }));

// Routes application.
app.get("/", (request, response) => response.json({ msg: "Welcome to the world logging application." }))

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => console.log("SERVER READY!!!"));
