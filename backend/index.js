require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const { PrismaClient } = require('@prisma/client');

const swaggerSpec = require('./swagger');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const prisma = new PrismaClient();

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is required in the backend .env file`);
  }
});

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim());

app.disable('x-powered-by');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '10kb' }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'task-void-api' }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);

const seedAdmin = async () => {
  try {
    const adminExists = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (!adminExists) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'adminpassword', 12);
      await prisma.user.create({
        data: {
          username: 'admin',
          passwordHash,
          role: 'admin',
        },
      });
    }
  } catch (error) {
    console.error('Admin seed failed:', error.message);
  }
};

const PORT = process.env.PORT || 5000;
const start = async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
};

if (require.main === module) {
  start().catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  });
}

module.exports = app;
