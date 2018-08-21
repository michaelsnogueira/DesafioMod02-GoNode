const express = require('express');

const routes = express.Router();
const authControllers = require('./controllers/authControllers');
const dashboardControllers = require('./controllers/dashboardControllers');
const authProjectsControllers = require('./controllers/authProjectsControllers');
const authSessionProjectControllers = require('./controllers/authSessionProjectControllers');
const userLogin = require('./middleware/auth');
const guestMiddleware = require('./middleware/guest');

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

routes.get('/', guestMiddleware, authControllers.signin);
routes.get('/signup', guestMiddleware, authControllers.signup);
routes.get('/signout', authControllers.signout);
routes.get('/show', authProjectsControllers.show);
routes.get('/sessionProject/:id', authSessionProjectControllers.show);
routes.get('/session/:id', authSessionProjectControllers.showSession);
routes.post('/:projectId/registerSession', authSessionProjectControllers.register);
routes.post('/registerProject', authProjectsControllers.register);
routes.post('/register', authControllers.register);
routes.post('/authenticate', authControllers.authenticate);
routes.delete('/destroy/:projectId', authProjectsControllers.destroy);
routes.delete('/destroySession/:id', authSessionProjectControllers.destroy);

routes.get('/dashboard', userLogin, dashboardControllers.index);

routes.use((req, res) => res.render('errors/404'));

routes.use((err, req, res, _next) => {
  res.status(err.status || 500);
  return res.render('errors/index', {
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

module.exports = routes;
