const fastify = require('fastify')({
  logger: false
});
const cors = require('@fastify/cors');
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
const { login } = require('./element/routes/login');
const { register } = require('./element/routes/register');
const { sendMail } = require('./element/routes/sendMail');
const { registerCompleet } = require('./element/routes/registerCompleet');



fastify.register(cors, {
  credentials: true,
  origin: 'http://localhost:5173',
});

const SECRET_KEY = 'mysecretkeysdfasdfasdfasdfasdsdaf';

fastify.register(fastifyCookie);

fastify.register(fastifySession, {
  secret: SECRET_KEY,
  cookieName: 'session_id',
  cookie: {
    path: '/',
    secure: false
  }
});

fastify.register(require("fastify-socket.io"), {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});



// Защищенный маршрут для проверки аутентификации
fastify.get('/api/profile', async (request, reply) => {
  if (!request.session.user) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  reply.send({ message: 'Protected route', user: request.session.user });
});



fastify.post('/login', login)

// fastify.post('/login', async (req, reply) => {
//   await login(req, reply);
// });



// Обработка маршрута /register
fastify.post('/register', async (request, reply) => {
  try {
    await register(request, reply);
    await sendMail(request, reply);
    return { success: true, message: 'Registration and email sent successfully' };
  } catch (error) {
    reply.status(500).send({ success: false, message: 'An error occurred during registration or email sending' });
  }
});


fastify.put('/register', registerCompleet)

fastify.register(require('./element/router'), { prefix: '/api' });


fastify.ready(err => {
  if (err) throw err;

  fastify.io.on('connect', socket => {
    // fastify.decorateRequest('io', socket);
    console.log('Client connected');

    socket.on('message', data => {
      console.log('Received message:', data);
      socket.send({ message: 'Message received' });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    console.log(`Server is now listening on ${address}`);
  });
});




