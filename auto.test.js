const request = require("supertest");
const app = require("./index"); // or ../index depending on where the test file is

describe("Auth API", () => {
  it("should register applicant", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Test Applicant",
      email: "applicant@test.com",
      role: "Applicant",
      password: "pass123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.role).toBe("Applicant");
  });
  it("should register reviewer", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Test Reviewer",
      email: "reviewer@test.com",
      role: "Reviewer",
      password: "pass123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.role).toBe("Reviewer");
  });

  it("should fail with invalid role", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Bob",
      email: "bob@test.com",
      role: "Admin",
      password: "pass123",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("Submission API", () => {
  let applicantToken, reviewerToken, submissionId;

  beforeAll(async () => {
    // login applicant
    const applicantRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "applicant@test.com", password: "pass123" });
    applicantToken = applicantRes.body.token;

    // console.log(`applicantToken: ${applicantToken}`);

    // login reviewer
    const reviewerRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "reviewer@test.com", password: "pass123" });
    reviewerToken = reviewerRes.body.token;

    // console.log(`reviewerToken: ${reviewerToken}`);
  });

  // CREATE
  it("applicant should create valid submission", async () => {
    const res = await request(app)
      .post("/api/v1/submissions")
      .set("Authorization", `Bearer ${applicantToken}`)
      .send({
        title: "Medical Leave",
        category: "Sick",
        description: "Flu recovery",
        startDate: new Date(Date.now() + 86400000), // tomorrow
        endDate: new Date(Date.now() + 172800000), // day after
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.submission.status).toBe("Submitted");
    submissionId = res.body.submission.id; // save for later tests
  });

  it("reviewer should not create submission", async () => {
    const res = await request(app)
      .post("/api/v1/submissions")
      .set("Authorization", `Bearer ${reviewerToken}`)
      .send({ title: "Invalid", category: "Sick", startDate: new Date() });
    expect(res.statusCode).toBe(403);
  });

  // READ
  it("applicant should fetch own submissions", async () => {
    const res = await request(app)
      .get("/api/v1/submissions")
      .set("Authorization", `Bearer ${applicantToken}`);
    expect(res.statusCode).toBe(200);
    expect(
      res.body.every(
        (s) => s.creatorId === res.body[0].creatorId,
      ),
    ).toBe(true);
  });

  // Reviewer fetch all submissions
  it("reviewer should fetch all submissions", async () => {
    const res = await request(app)
      .get("/api/v1/submissions")
      .set("Authorization", `Bearer ${reviewerToken}`);
    expect(res.statusCode).toBe(200);

    const submissions = res.body.submissions || res.body;
    expect(Array.isArray(submissions)).toBe(true);
    expect(submissions.length).toBeGreaterThan(0);
  });

  it("should fetch submission by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/submissions/${submissionId}`)
      .set("Authorization", `Bearer ${applicantToken}`);
    if (res.statusCode === 403) {
      // fallback: try with reviewer
      const reviewerRes = await request(app)
        .get(`/api/v1/submissions/${submissionId}`)
        .set("Authorization", `Bearer ${reviewerToken}`);
      expect(reviewerRes.statusCode).toBe(200);
      expect(reviewerRes.body.id).toBe(submissionId);
    } else {
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(submissionId);
    }
  });

  // UPDATE
  it("applicant should not update Approved submission", async () => {
    // reviewer first approves
    await request(app)
      .put(`/api/v1/submissions/${submissionId}`)
      .set("Authorization", `Bearer ${reviewerToken}`)
      .send({ status: "UnderReview" });

    await request(app)
      .put(`/api/v1/submissions/${submissionId}`)
      .set("Authorization", `Bearer ${reviewerToken}`)
      .send({ status: "Approved", comment: "Looks good" });

    // applicant tries to edit
    const res = await request(app)
      .put(`/api/v1/submissions/${submissionId}`)
      .set("Authorization", `Bearer ${applicantToken}`)
      .send({ title: "Updated Title" });
    expect(res.statusCode).toBe(403);
  });

  it("reviewer should reject with comment", async () => {
    // create another submission to reject
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

    // reviewer moves to UnderReview then rejects
    await request(app)
      .put(`/api/v1/submissions/${newSubmissionId}`)
      .set("Authorization", `Bearer ${reviewerToken}`)
      .send({ status: "UnderReview" });

    const rejectRes = await request(app)
      .put(`/api/v1/submissions/${newSubmissionId}`)
      .set("Authorization", `Bearer ${reviewerToken}`)
      .send({ status: "Rejected", comment: "Insufficient details" });

    expect(rejectRes.statusCode).toBe(200);
    expect(rejectRes.body.comment).toBe("Insufficient details");
    expect(rejectRes.body.status).toBe("Rejected");
  });
});
