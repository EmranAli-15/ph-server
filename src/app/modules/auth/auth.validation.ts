import { z } from "zod";

const loginValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'ID is required' }),
        password: z.string({ required_error: 'PASSWORD is required' }),
    }),
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'old password is required' }),
        newPassword: z.string({ required_error: 'PASSWORD is required' }),
    }),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({required_error: 'Refresh Token is required'})
    })
});

const forgetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({required_error: 'User id is required'})
    })
});

export const authValidations = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema
};