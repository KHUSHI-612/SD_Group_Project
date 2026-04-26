import { z } from "zod";

const phoneRegex = /^[0-9]{10,15}$/;

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || z.string().email().safeParse(value).success, {
        message: "Enter a valid email address",
      }),
    phoneNumber: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || phoneRegex.test(value), {
        message: "Enter a valid phone number",
      }),
    address: z.string().trim().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    govt_id: z.instanceof(File, { message: "Identity proof is required" }),
  })
  .refine((data) => !!data.email || !!data.phoneNumber, {
    message: "Either email or phone number is required",
    path: ["email"],
  });

export const loginSchema = z
  .object({
    identifier: z.string().trim().min(1, "Email or phone number is required"),
    password: z.string().min(1, "Password is required"),
  })
  .superRefine((data, ctx) => {
    const value = data.identifier.trim();
    const isEmail = value.includes("@");
    const isPhone = phoneRegex.test(value);

    if (!isEmail && !isPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["identifier"],
        message: "Enter a valid email or phone number",
      });
    }
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;