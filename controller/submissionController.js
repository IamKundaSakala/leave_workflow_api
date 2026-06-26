// controllers/submissionController.js
const db = require('../models');
const { Submission } = db;

// Get all submissions
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.findAll();
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one submission
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create submission
exports.createSubmission = async (req, res) => {
  try {
    const submission = await Submission.create(req.body);
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update submission
exports.updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    await submission.update(req.body);
    res.json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
