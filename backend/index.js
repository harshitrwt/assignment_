require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const { PrismaClient } = require('@prisma/client');

const swaggerSpec = require('./swagger');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

const seedAdmin = async () => {
  try {
    const adminExists = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('adminpassword', salt);
      await prisma.user.create({
        data: {
          username: 'admin',
          passwordHash,
          role: 'admin',
        },
      });
    }
  } catch (error) {
    //
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await seedAdmin();
});
