const path = require('path');
const express = require("express");
const dotenv = require("dotenv");

const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require("cors");

dotenv.config({ path: "config.env" });
const morgan = require("morgan");
// eslint-disable-next-line import/no-extraneous-dependencies
const swaggerUi = require("swagger-ui-express");
// eslint-disable-next-line import/no-extraneous-dependencies
const { Server } = require("socket.io");
const http = require("http");
const swaggerSpec = require("./utils/swagger/swaggerConfig");
const dbConnection = require('./config/database');
const ApiError = require('./utils/api_error')
const globalError = require('./middlewares/error_middleware');

//db connection
const mountRouts = require('./api');

dbConnection();



// express app
const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// we want to compress all responses
app.use(compression());

// Middlewares
app.use(express.json({limit: '20kb'})); // limit response size

app.use(express.static(path.join(__dirname, 'uploads')))

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp({whitelist: ['price', 'sold', 'quantity']}));

//to avoid brute-force attacks
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    'Too many requests created from this ip, please try again later.',
})

app.use(limiter);
app.use(mongoSanitize());
// Routes
mountRouts(app);

// swagger

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.all("*", (req, res, next) => {
  // create error and send it to error handling middleware
  next(new ApiError(`can't find this end point: ${req.originalUrl}`, 400));
})

// Global error handle middlewares return error as you like
app.use(globalError)

const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Or restrict to admin panel domain in production
  },
});

// Store globally to emit from anywhere
global.io = io;

io.on("connection", (socket) => {
  console.log("🟢 WebSocket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔌 WebSocket disconnected:", socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});


process.on('unhandledRejection', (err) => {
  console.error(`fail: ${err.name} | ${err.message}`);
  httpServer.close(() => {
    console.log(`app shutting down....`);
    process.exit(1);
  });
});

