import {z} from "zod"


const nameSchema = z.string().min(2, "Name must be at least 2 characters long").max(100, "Name must be less than 100 characters long");
const usernameSchema = z.string().min(3, "Username must be at least 3 characters long").max(30, "Username must be less than 30 characters long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");
const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters long").max(100, "Password must be less than 100 characters long").regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, "Password must contain at least one letter and one number");


export const registerSchema = z.object({
    name : nameSchema,
    username : usernameSchema,
    email : emailSchema,
    password : passwordSchema
})


export const loginUserSchema = z.object({
    email : emailSchema,
    password : passwordSchema
})