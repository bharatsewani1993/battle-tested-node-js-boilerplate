const path = require('path');
const express = require("express");
let cors = require('cors');
const ENV = require('./env/index').envSettings();
const app = express();
const port = ENV.PORT;
const { master } = require('./utils/boot');
const { initCron } = require('./controllers/cronController');
const emailTemplates = require("./templates/email");
const emailService = require("./services/system/emailService");
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');
const redis = require("./config/redis");
app.use(requestIp.mw());

// Set the custom views folder
app.set('views', path.join(__dirname, 'views'));
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('view cache', true);
// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public', { maxAge: ENV.STATIC_MAX_AGE })); //, { maxAge: 31536000 } 1 year

console.log("ENV", ENV.STAGE);

//to allow cors access
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, cache-control, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, authorization, Authorization"
  );
  next();
});

//Define Rate Limit for This Function
const limiter = rateLimit({
  windowMS: ENV.API_LIMIT_WINDOW,//30 second in MS
  max: ENV.MAX_API_LIMIT,//limit Each Ip to 4 requests per 30 second
  message: 'To Many requests, please try again later.'
})

app.use(limiter);
app.use(cors());

//importing database connection 
const database = require('./config/mysql');

//initiate body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// fixing "413 Request Entity Too Large" errors
app.use(express.json({ limit: "10mb", extended: true }))
app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }))


const corsOptions = {
  origin: '*', // Allow all origins
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight request handling

//import the routes
const systemRoutes = require('./routers/public/systemRouter');

//using routes
app.use('', systemRoutes);


if (ENV.STAGE != 'LOCAL') {
  process.on('uncaughtException', (error) => {
    //send email to system admin.
    const emailObj = {
      to: ENV.SYSTEM_ADMIN_EMAIL,
      subject: `Some Critical Error occured at ${ENV.STAGE} User Service`,
      html: emailTemplates.criticalServerErrorTemplate(error),
    };

    emailService.sendEmail(emailObj);
  });
}

// Check Redis server connection
redis.ping((err, result) => {
  if (err) {
    console.error('Error connecting to Redis server:', err);
  } else {
    console.log('Connected to Redis server:', result);

    // Perform database synchronization
    database.sync(ENV.DB_ALTER)
      .then(() => {
        console.log('Database synchronized successfully');

        // Start the server
        app.listen(port, () => {
          master();
          console.log(`\nServer started on port ${port}`);
          if (ENV.CRON_ENABLED) {
            initCron();
          }
        });
      })
      .catch(error => {
        console.log("Error synchronizing database:", error);
      });
  }
});