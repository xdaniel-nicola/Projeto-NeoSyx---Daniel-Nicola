// import express from 'express'
// import http from 'http'
// import Router from 'express'
// import routes from './routes'
// import dotenv from 'dotenv'
// import { Server } from 'socket.io'
// import cors from 'cors'

// const app = express()
// const router = Router()
// const server = http.createServer(app)
// const io = new Server(server, { cors: { origin: "http://localhost:3000" } })

// const corsOptions = {
//   origin: '*'
// }

// app.use(cors(corsOptions))
// app.use(express.json())

// router.use('/api', routes)

// dotenv.config()

// app.use(router)

// const connectedUsers = new Map<string, string>()

// io.use((socket, next) => {
//   const user = socket.handshake.auth.user
//   if(!user) {
//     return next(new Error('Usuário Inválido'))
//   }

//   /* @ts-expect-error: */
//   socket.username = user.name
//   /* @ts-expect-error: */
//   socket.userId = user.id  
//   next()
// })

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id );

//   /* @ts-expect-error: */
//   connectedUsers.set(socket.userId, socket.username)

//   io.emit('users-online', Array.from(connectedUsers, ([id, name]) => ({id, name})))

//   socket.on('join-room', (room: string) => {
//     socket.join(room);    
//   });

//   socket.on('message', ({to, message}) => {

//     /* @ts-expect-error: */
//     const from = connectedUsers.get(socket.userId)

//     if(!from || !connectedUsers.get(to.id)) {
//       return;
//     }

//     console.log(message)
    
//     io.to(to.id).emit('message', message);
//   });
  
//   socket.on('disconnect', () => {
//     console.log('user disconnected:', socket.id)    
//     /* @ts-expect-error: */
//     connectedUsers.delete(socket.userId)
//     io.emit('users-online', Array.from(connectedUsers, ([id, name]) => ({id, name})))

//   })
// })

// server.listen(process.env.APP_PORT, () => {
//   console.log('Server is running on http://localhost:' + process.env.APP_PORT)
// })

import express from 'express';
import http from 'http';
import Router from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json());

const router = Router();
router.use('/api', routes);
app.use(router);

const connectedUsers = new Map<string, { id: string, name: string }>();

io.use((socket, next) => {
  const user = socket.handshake.auth.user;
  if (!user) {
    return next(new Error('Usuário Inválido'));
  }

  socket.data.username = user.name;
  socket.data.userId = user.id;
  next();
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  connectedUsers.set(socket.data.userId, { id: socket.id, name: socket.data.username });

  io.emit('users-online', Array.from(connectedUsers.values()));

  socket.on('join-room', (room: string) => {
    socket.join(room);
  });

  socket.on('message', ({ to, message }) => {
    const from = connectedUsers.get(socket.data.userId);

    if (!from || !connectedUsers.has(to.id)) {
      return;
    }

    console.log('Message:', message);

    io.to(to.id).emit('message', { from, message });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers.delete(socket.data.userId);
    io.emit('users-online', Array.from(connectedUsers.values()));
  });
});

server.listen(process.env.APP_PORT, () => {
  console.log('Server is running on http://localhost:' + process.env.APP_PORT);
});
