import { eq } from "drizzle-orm";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { db } from "../src/database/index.js";
import { usersTable } from "../src/database/schema.js";

async function clearUsers() {
  await db.delete(usersTable);
}

describe("Users module Integration Tests", () => {
  let adminToken: string;
  let userAToken: string;
  let userAId: string;
  let userBId: string;

  beforeEach(async () => {
    await clearUsers();

    const resA = await request(app).post("/auth/register").send({
      full_name: "User A",
      birth_date: "01.01.1990",
      email: "a@example.com",
      password: "password123",
    });
    userAId = resA.body.data.user.id;

    const loginA = await request(app).post("/auth/login").send({
      email: "a@example.com",
      password: "password123",
    });
    userAToken = loginA.body.data.tokens.accessToken;

    const resB = await request(app).post("/auth/register").send({
      full_name: "User B",
      birth_date: "02.02.1990",
      email: "b@example.com",
      password: "password123",
    });
    userBId = resB.body.data.user.id;

    await request(app).post("/auth/login").send({
      email: "b@example.com",
      password: "password123",
    });

    await request(app).post("/auth/register").send({
      full_name: "Admin User To Rule The World An Get This Job",
      birth_date: "03.03.1980",
      email: "admin@example.com",
      password: "password123",
    });

    await db
      .update(usersTable)
      .set({ role: "admin" })
      .where(eq(usersTable.email, "admin@example.com"));

    const loginAdmin = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });
    adminToken = loginAdmin.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await clearUsers();
  });

  describe("GET /users", () => {
    it("should allow admin to list users", async () => {
      const res = await request(app).get("/users").set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it("should deny regular user from listing users", async () => {
      const res = await request(app).get("/users").set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /users/:id", () => {
    it("should allow user to get own profile", async () => {
      const res = await request(app)
        .get(`/users/${userAId}`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(userAId);
    });

    it("should deny user from getting another's profile", async () => {
      const res = await request(app)
        .get(`/users/${userBId}`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
    });

    it("should allow admin to get any profile", async () => {
      const res = await request(app)
        .get(`/users/${userAId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(userAId);
    });
  });

  describe("PATCH /users/:id/block", () => {
    it("should allow user to block themselves", async () => {
      const res = await request(app)
        .patch(`/users/${userAId}/block`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("blocked");
    });

    it("should allow admin to block a user", async () => {
      const res = await request(app)
        .patch(`/users/${userBId}/block`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("blocked");
    });

    it("should deny user from blocking another user", async () => {
      const res = await request(app)
        .patch(`/users/${userBId}/block`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe("Blocked User Scenarios", () => {
    it("should deny blocked user from logging in", async () => {
      await request(app)
        .patch(`/users/${userAId}/block`)
        .set("Authorization", `Bearer ${userAToken}`);

      const res = await request(app).post("/auth/login").send({
        email: "a@example.com",
        password: "password123",
      });

      expect(res.status).toBe(403);
    });

    it("should deny blocked user from accessing API", async () => {
      await request(app)
        .patch(`/users/${userAId}/block`)
        .set("Authorization", `Bearer ${userAToken}`);

      const res = await request(app)
        .get(`/users/${userAId}`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
    });
  });
});
