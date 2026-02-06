import { eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import { usersTable } from "../../database/schema.js";
import type { RegisterBody } from "./auth.schema.js";

export const authRepository = {
  async createUser(data: RegisterBody) {
    const [user] = await db.insert(usersTable).values(data).returning();
    return user;
  },

  async findUserByEmail(email: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    return user;
  },

  async findUserById(id: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return user;
  },
};
