import { z } from "zod";

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    limit: z.coerce.number().min(1).max(100).default(10),
    offset: z.coerce.number().min(0).default(0),
  }),
});

export const blockUser = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type GetUserParams = z.infer<typeof getUserSchema>["params"];
export type GetUsersQuery = z.infer<typeof getUsersSchema>["query"];
export type BlockUserParams = z.infer<typeof blockUser>["params"];
