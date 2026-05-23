import { z } from "zod";

export const getRoleByIdSchema = z.object({
  roleId: z.uuid(),
});
