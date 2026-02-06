import { eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import { usersTable, UserStatus } from "../../database/schema.js";

export const userRepository = {
  async findById(id: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return user;
  },

  async findAll(limit: number = 10, offset: number = 0) {
    return await db.select().from(usersTable).limit(limit).offset(offset);
  },

  async updateStatus(id: string, status: UserStatus) {
    const [user] = await db
      .update(usersTable)
      .set({ status, updated_at: new Date() })
      .where(eq(usersTable.id, id))
      .returning();
    return user;
  },
};
