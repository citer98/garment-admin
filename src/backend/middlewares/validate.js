export const validateOrder = (req, res, next) => {
  const requiredFields = ['customerName', 'productType', 'quantity', 'deadline'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // Validate quantity
  if (req.body.quantity <= 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Quantity must be greater than 0'
    });
  }

  // Validate deadline (must be in the future)
  const deadline = new Date(req.body.deadline);
  if (deadline <= new Date()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Deadline must be in the future'
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Email and password are required'
    });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Invalid email format'
    });
  }

  next();
};