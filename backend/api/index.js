const authRoute = require('./authApi');
const userRoute = require('./userApi');
const categoryRoute = require('./categoryApi');
const eventRoute = require('./eventApi');
const bookingRoute = require('./bookingApi');

const mountRoutes = (app) => {
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/categories', categoryRoute);
  app.use('/api/v1/events', eventRoute);
  app.use('/api/v1/bookings', bookingRoute);
};

module.exports = mountRoutes;
