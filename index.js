const fastify = require('fastify')({
  logger: false
});
const cors = require('@fastify/cors');
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
const { login } = require('./element/routes/login');

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




// Защищенный маршрут для проверки аутентификации
fastify.get('/api/profile', async (request, reply) => {
  if (!request.session.user) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  reply.send({ message: 'Protected route', user: request.session.user });
});



fastify.post('/login', login)
fastify.register(require('./element/router'), { prefix: '/api' });

// fastify.register()

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});
