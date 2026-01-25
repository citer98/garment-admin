import prisma from '../config/database.js';
import { getIO } from '../config/websocket.js';

// Helper function to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { customerName, productType, quantity, deadline, priority, notes } = req.body;
    
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: req.user.id,
        customerName,
        productType,
        quantity,
        deadline: new Date(deadline),
        priority: priority || 'normal',
        notes,
        timelines: {
          create: [
            { step: 'cutting', status: 'pending' },
            { step: 'sewing', status: 'pending' },
            { step: 'finishing', status: 'pending' },
            { step: 'quality_check', status: 'pending' }
          ]
        }
      },
      include: {
        timelines: true
      }
    });

    // Emit WebSocket event
    const io = getIO();
    io.emit('new_order', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName,
      productType,
      quantity,
      status: order.status,
      timestamp: new Date().toISOString()
    });

    // Create notification for admins
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        type: 'order_update',
        title: 'New Order Created',
        message: `Order ${order.orderNumber} has been created`,
        relatedId: order.id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const where = status ? { status } : {};
    
    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: { name: true, email: true, phone: true }
        },
        timelines: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });

    const total = await prisma.order.count({ where });

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: {
          select: { name: true, email: true, phone: true }
        },
        timelines: {
          include: {
            operator: {
              select: { name: true, role: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

// Update order progress
export const updateOrderProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { step, status, operatorId, notes } = req.body;
    
    // Update timeline
    const timeline = await prisma.timeline.updateMany({
      where: {
        orderId: parseInt(id),
        step
      },
      data: {
        status,
        operatorId,
        notes,
        ...(status === 'in_progress' && { startedAt: new Date() }),
        ...(status === 'completed' && { completedAt: new Date() })
      }
    });

    // Get updated timeline
    const updatedTimeline = await prisma.timeline.findFirst({
      where: {
        orderId: parseInt(id),
        step
      }
    });

    // Check if all steps are completed
    const allTimelines = await prisma.timeline.findMany({
      where: { orderId: parseInt(id) }
    });

    const allCompleted = allTimelines.every(t => t.status === 'completed');
    
    let orderStatus = 'in_progress';
    if (allCompleted) {
      orderStatus = 'quality_check';
    } else if (step === 'quality_check' && status === 'completed') {
      orderStatus = 'completed';
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status: orderStatus,
        ...(orderStatus === 'completed' && { completedAt: new Date() })
      },
      include: {
        timelines: true
      }
    });

    // Emit WebSocket event
    const io = getIO();
    io.to(`order_${id}`).emit('order_updated', {
      orderId: id,
      step,
      status,
      orderStatus: order.status,
      timestamp: new Date().toISOString(),
      operatorId,
      notes
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        type: 'order_update',
        title: 'Order Progress Updated',
        message: `Step ${step} of order ${order.orderNumber} is now ${status}`,
        relatedId: parseInt(id)
      }
    });

    res.json({
      success: true,
      message: 'Order progress updated',
      order,
      timeline: updatedTimeline
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update order progress' });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Delete order (cascade will delete timelines)
    await prisma.order.delete({
      where: { id: parseInt(id) }
    });

    // Emit WebSocket event
    const io = getIO();
    io.emit('order_deleted', {
      orderId: id,
      orderNumber: order.orderNumber,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};