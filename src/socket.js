const socket = (io) => {
  io.on('connection', (socket) => {
    const socketId = socket.id;

    logger.info('New websocket connection established: ', socketId);

    io.to(socketId).emit('ack', socketId);

    socket.on('re-ack', (msg) => {
      clientSocketMap[msg.clientId] = socketId;
    });

    socket.on(MSG_FROM_CLIENT, (payload) => {
      const { from, to } = payload;
      const toSocketId = clientSocketMap[to];
      const fromSocketId = clientSocketMap[from];

      console.log(payload);

      // Sending to destination recepient
      io.to(toSocketId).emit(MSG_FROM_SERVER, payload);

      // Sending to sender again for showing it in UI
      io.to(fromSocketId).emit(MSG_FROM_SERVER, payload);

      // broadcase message to everyone
      //io.emit(MSG_FROM_SERVER, msg);
    });
  });
};

export default socket;
