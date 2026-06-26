const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { default: authenticateToken } = require('./middleware/authenticateToken');

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
 function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user; // attach decoded payload (id, email, role)
    next();
  });
}

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
app.get('/api/v1/submissions',authenticateToken, async (req, res) => {
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
app.get('/api/v1/submissions/:id',authenticateToken, async (req, res) => {
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
app.post('/api/v1/submissions',authenticateToken, async (req, res) => {
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
app.put('/api/v1/submissions/:id',authenticateToken, async (req, res) => {
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
// --- Register user ---
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    if(role != 'applicant' || role != 'reviewer'){
      res.status(400).json({message: "Process failed, user role should be 'applicant' or 'reviewer'"});
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      role,
      password: hashedPassword
    });

    res.json({ message: 'User registered', user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Workflow API running on http://localhost:3000'));
