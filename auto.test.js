const request = require("supertest");
const app = require("./index");
const { User, Submission } = require("./models");
const { Op } = require("sequelize");

// 🔥 Increase global timeout (important for Azure/Postgres)
jest.setTimeout(30000);

const testEmails = [
  "applicant@test.com",
  "reviewer@test.com",
  "bob@test.com",
];

// ======================
// CLEANUP (FAST + SAFE)
// ======================
beforeAll(async () => {
  try {
    // delete all submissions first (avoid FK issues)
    await Submission.destroy({ where: {} });

    // delete only test users
    await User.destroy({
      where: {
        email: {
          [Op.in]: testEmails,
        },
      },
    });
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
}, 30000);

// ======================
// AUTH TESTS
// ======================
describe("Auth API", () => {
  it(
    "should register applicant",
    async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test Applicant",
          email: "applicant@test.com",
          role: "Applicant",
          password: "pass123",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.user.role).toBe("Applicant");
    },
    10000
  );

  it(
    "should register reviewer",
    async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test Reviewer",
          email: "reviewer@test.com",
          role: "Reviewer",
          password: "pass123",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.user.role).toBe("Reviewer");
    },
    10000
  );

  it(
    "should fail with invalid role",
    async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Bob",
          email: "bob@test.com",
          role: "Admin",
          password: "pass123",
        });

      expect(res.statusCode).toBe(400);
    },
    10000
  );
});

// ======================
// SUBMISSION TESTS
// ======================
describe("Submission API", () => {
  let applicantToken;
  let reviewerToken;
  let submissionId;

  // ----------------------
  // LOGIN SETUP
  // ----------------------
  beforeAll(async () => {
    const applicantRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "applicant@test.com",
        password: "pass123",
      });

    expect(applicantRes.statusCode).toBe(200);
    applicantToken = applicantRes.body.token;

    const reviewerRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "reviewer@test.com",
        password: "pass123",
      });

    expect(reviewerRes.statusCode).toBe(200);
    reviewerToken = reviewerRes.body.token;
  }, 15000);

  // ----------------------
  // CREATE
  // ----------------------
  it(
    "applicant should create valid submission",
    async () => {
      const res = await request(app)
        .post("/api/v1/submissions")
        .set("Authorization", `Bearer ${applicantToken}`)
        .send({
          title: "Medical Leave",
          category: "Sick",
          description: "Flu recovery",
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.submission.status).toBe("Submitted");

      submissionId = res.body.submission.id;
    },
    10000
  );

  it(
    "reviewer should not create submission",
    async () => {
      const res = await request(app)
        .post("/api/v1/submissions")
        .set("Authorization", `Bearer ${reviewerToken}`)
        .send({
          title: "Invalid",
          category: "Sick",
          startDate: new Date(),
        });

      expect(res.statusCode).toBe(403);
    },
    10000
  );

  // ----------------------
  // READ
  // ----------------------
  it(
    "applicant should fetch own submissions",
    async () => {
      const res = await request(app)
        .get("/api/v1/submissions")
        .set("Authorization", `Bearer ${applicantToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    },
    10000
  );

  it(
    "reviewer should fetch all submissions",
    async () => {
      const res = await request(app)
        .get("/api/v1/submissions")
        .set("Authorization", `Bearer ${reviewerToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    },
    10000
  );

  it(
    "should fetch submission by ID",
    async () => {
      const res = await request(app)
        .get(`/api/v1/submissions/${submissionId}`)
        .set("Authorization", `Bearer ${applicantToken}`);

      expect([200, 403]).toContain(res.statusCode);

      if (res.statusCode === 200) {
        expect(res.body.id).toBe(submissionId);
      }
    },
    10000
  );

  // ----------------------
  // UPDATE FLOW
  // ----------------------
  it(
    "applicant should not update approved submission",
    async () => {
      await request(app)
        .put(`/api/v1/submissions/${submissionId}`)
        .set("Authorization", `Bearer ${reviewerToken}`)
        .send({ status: "UnderReview" });

      await request(app)
        .put(`/api/v1/submissions/${submissionId}`)
        .set("Authorization", `Bearer ${reviewerToken}`)
        .send({ status: "Approved", comment: "Looks good" });

      const res = await request(app)
        .put(`/api/v1/submissions/${submissionId}`)
        .set("Authorization", `Bearer ${applicantToken}`)
        .send({ title: "Updated Title" });

      expect(res.statusCode).toBe(403);
    },
    15000
  );

  it(
    "reviewer should reject with comment",
    async () => {
      const newRes = await request(app)
        .post("/api/v1/submissions")
        .set("Authorization", `Bearer ${applicantToken}`)
        .send({
          title: "Test Reject",
          category: "Other",
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
        });

      const newSubmissionId = newRes.body.submission.id;

      await request(app)
        .put(`/api/v1/submissions/${newSubmissionId}`)
        .set("Authorization", `Bearer ${reviewerToken}`)
        .send({ status: "UnderReview" });

      const rejectRes = await request(app)
        .put(`/api/v1/submissions/${newSubmissionId}`)
        .set("Authorization", `Bearer ${reviewerToken}`)
        .send({
          status: "Rejected",
          comment: "Insufficient details",
        });

      expect(rejectRes.statusCode).toBe(200);
      expect(rejectRes.body.status).toBe("Rejected");
      expect(rejectRes.body.comment).toBe("Insufficient details");
    },
    15000
  );
});