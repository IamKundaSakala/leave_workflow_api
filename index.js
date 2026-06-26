const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

// --- Swagger Setup ---
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Workflow Management API',
      version: '1.0.0',
      description: 'API for submissions and user authentication'
    },
  },
  apis: ['./index.js'], // path to files with annotations
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// --- Submissions Routes ---

/**
 * @swagger
 * /api/v1/submissions:
 *   get:
 *     summary: Get all submissions
 *     responses:
 *       200:
 *         description: List of submissions
 */
app.get('/api/v1/submissions', async (req, res) => {
  res.json({ message: 'List of submissions' });
});

/**
 * @swagger
 * /api/v1/submissions/{id}:
 *   get:
 *     summary: Get one submission
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Submission object
 */
app.get('/api/v1/submissions/:id', async (req, res) => {
  res.json({ message: `Submission ${req.params.id}` });
});

/**
 * @swagger
 * /api/v1/submissions:
 *   post:
 *     summary: Create a submission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission created
 */
app.post('/api/v1/submissions', async (req, res) => {
  res.json({ message: 'Submission created', data: req.body });
});

/**
 * @swagger
 * /api/v1/submissions/{id}:
 *   put:
 *     summary: Update a submission
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission updated
 */
app.put('/api/v1/submissions/:id', async (req, res) => {
  res.json({ message: `Submission ${req.params.id} updated`, data: req.body });
});

// --- Auth Routes ---

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered
 */
app.post('/api/v1/auth/register', async (req, res) => {
  res.json({ message: 'User registered', data: req.body });
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 */
app.post('/api/v1/auth/login', async (req, res) => {
  res.json({ message: 'User logged in', data: req.body });
});

app.listen(3000, () => console.log('Workflow API running on http://localhost:3000'));
