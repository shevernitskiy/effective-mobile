import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { db } from "../src/database/index.js";
import { usersTable } from "../src/database/schema.js";

async function clearUsers() {
  await db.delete(usersTable).returning();
}

describe("Auth module Integration Tests", () => {
  beforeEach(async () => {
    await clearUsers();
  });

  afterAll(async () => {
    await clearUsers();
  });

  const userData = {
    full_name: "Test Testovich Testov",
    birth_date: "01.01.2000",
    email: "ya-ne-bot@example.com",
    password: "12345678",
  };

  it("should register new user", async () => {
    const response = await request(app).post("/auth/register").send(userData);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user).toHaveProperty("id");
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.user).not.toHaveProperty("password");
  });

  it("should not register user with existing email", async () => {
    await request(app).post("/auth/register").send(userData);

    const response = await request(app).post("/auth/register").send(userData);

    expect(response.status).toBe(409);
  });

  it("should login successfully with correct credentials", async () => {
    await request(app).post("/auth/register").send(userData);

    const response = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user).not.toHaveProperty("password");
    expect(response.body.data).toHaveProperty("tokens");
    expect(response.body.data.tokens).toHaveProperty("accessToken");
    expect(response.body.data.tokens).toHaveProperty("refreshToken");
  });

  it("should not login with incorrect credentials", async () => {
    await request(app).post("/auth/register").send(userData);

    const response = await request(app).post("/auth/login").send({
      email: userData.email,
      password: "super-wrong-password",
    });

    expect(response.status).toBe(401);
  });
});
