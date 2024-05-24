"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    password: zod_1.z.string().max(20, { message: 'password can not be more than 20 character' }),
    needsPasswordChange: zod_1.z.boolean().optional().default(true),
    role: zod_1.z.enum(['student', 'faculty', 'admin']),
    status: zod_1.z.enum(['in-progress', 'blocked']).default('in-progress'),
    isDeleted: zod_1.z.boolean().optional().default(false)
});
exports.UserValidation = {
    userValidationSchema,
};
