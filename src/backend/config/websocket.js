import { Server } from 'socket.io';

let ioInstance = null;

export const initializeWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }
  });

  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 WebSocket client connected: ${socket.id}`);

    // Join order room
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`👥 Socket ${socket.id} joined order_${orderId}`);
    });

    // Leave order room
    socket.on('leave_order', (orderId) => {
      socket.leave(`order_${orderId}`);
    });

    // Order progress update
    socket.on('order_progress_update', (data) => {
      const { orderId, step, status, operatorName } = data;
      
      // Broadcast to order room
      io.to(`order_${orderId}`).emit('progress_updated', {
        orderId,
        step,
        status,
        operatorName,
        timestamp: new Date().toISOString()
      });

      // Notify admins/managers
      io.emit('admin_notification', {
        type: 'order_update',
        orderId,
        step,
        status,
        message: `Order ${orderId}: ${step} is now ${status}`
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 WebSocket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
};