const fastify = require('fastify')();
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
fastify.register(fastifyCookie);


const SECRET_KEY = 'mysecretkeysdfasdfasdfasdfasdsdaf';

// Простой массив пользователей для примера
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

fastify.register(fastifySession, {
  secret: SECRET_KEY,
  cookieName: 'session_id',
  cookie: {
    path: '/',
    secure: false
  }
});

// Маршрут для аутентификации пользователя
fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body;

  // Проверяем пользователя по логину и паролю
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return reply.code(401).send({ error: 'Invalid credentials' });
  }

  // Создаем сессию и сохраняем информацию о пользователе
  request.session.user = { id: user.id, username: user.username };

  reply.send({ message: 'Login successful' });
});

// Защищенный маршрут для проверки аутентификации
fastify.get('/api/profile', async (request, reply) => {
  if (!request.session.user) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  reply.send({ message: 'Protected route', user: request.session.user });
});

fastify.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server running on http://localhost:3000');
});

