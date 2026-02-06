import { InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const RoleEnum = pgEnum("role", ["admin", "user"]);
export const StatusEnum = pgEnum("status", ["active", "blocked"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  full_name: varchar("full_name", { length: 255 }).notNull(),
  birth_date: varchar("birth_date", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: RoleEnum("role").default("user").notNull(),
  status: StatusEnum("status").default("active").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type User = InferSelectModel<typeof usersTable>;
export type UserRole = User["role"];
export type UserId = User["id"];
export type UserStatus = User["status"];
