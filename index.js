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


const origin = 'http://localhost:5173'
// const origin = 'http://localhost:4173'

fastify.register(cors, {
  credentials: true,
  origin,
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
    origin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});


// fastify.register(require('@fastify/multipart'))

// Защищенный маршрут для проверки аутентификации
fastify.get('/api/profile', async (request, reply) => {
  if (!request.session.user) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  reply.send({ message: 'Protected route', user: request.session.user });
});



fastify.post('/login', login)

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


//  скачать файл с изменением имени `${company_id}/${dialog_id}/`
fastify.get('/download/:url', async (request, reply) => {
  const newFileName = 'newFileName.jpg'
  // const { u } = request.body
  // console.log(u)
  const u ='http://ew-ks3-buket.ks3-sgp.ksyuncs.com/1/48/601?KSSAccessKeyId=AKLT6XM36m9LTh2SVvGIZDDS&Expires=1723553009&Signature=4ePaGY7zDTcKxR5MRpU0OTHe7WY%3D'
  try {
    reply.redirect(`${u}`, 302).header('Content-Disposition', `attachment; filename="${newFileName}"`);
  } catch (error) {
    console.error(error);
    reply.status(500).send('Ошибка при получении URL');
  }
});


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




