// controllers/submissionController.js
const db = require("../models");
const { Submission } = db;

// Get all submissions
exports.getAllSubmissions = async (req, res) => {
  try {
    // if user is reviewer, return all submissions
    if (req.user.role == "Reviewer") {
      const submissions = await Submission.findAll();
      res.status(200).json(submissions);
    }
    // else just return their submissions
    const submissions = await Submission.findAll({
      where: { creatorId: req.user.id },
    });
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one submission
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission)
      return res.status(404).json({ error: "Submission not found" });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create submission (only Applicant role)
exports.createSubmission = async (req, res) => {
  try {
    // Check role from JWT payload
    if (req.user.role !== "Applicant") {
      return res
        .status(403)
        .json({ error: "Only Applicants can create submissions" });
    }

    const { title, category, description, startDate, endDate } = req.body;

    // Basic validation
    if (!title || !category || !startDate) {
      return res
        .status(400)
        .json({ error: "Title, category, and startDate are required" });
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    // start date must not be in the past
    if (start < now) {
      return res
        .status(400)
        .json({ error: "Leave start date cannot be in the past" });
    }

    // start date must be before end date
    if (end && start > end) {
      return res
        .status(400)
        .json({ error: "Leave start date should be before leave end date" });
    }

    // Create submission
    const submission = await Submission.create({
      title,
      category,
      description,
      startDate,
      endDate,
      creatorId: req.user.id, // from JWT
      status: "Submitted", // default when created
      dateCreated: new Date(),
    });

    res.status(201).json({
      message: "Submission created successfully",
      submission,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update submission
exports.updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission)
      return res.status(404).json({ error: "Submission not found" });
    await submission.update(req.body);
    res.json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
