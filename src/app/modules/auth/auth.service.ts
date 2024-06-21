import config from "../../config";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { loginUserInterface } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import createToken from "./auth.utils";
import { CLIENT_RENEG_LIMIT } from "tls";
import sendEmail from "../../utils/sendEmail";

const loginUser = async (payload: loginUserInterface) => {
    // check if the user is exist
    const isUserExist = await User.findOne({
        id: payload?.id
    });

    if (!isUserExist) {
        throw new AppError(400, 'User not FOUNDED!');
    };
    if (isUserExist?.isDeleted === true) {
        throw new AppError(400, 'User is DELETED!');
    };
    if (isUserExist?.status === 'blocked') {
        throw new AppError(403, 'User is BLOCKED!');
    };
    if (isUserExist?.password !== payload.password) {
        throw new AppError(403, 'Password not matched!');
    };


    const jwtPayload = {
        userId: isUserExist.id,
        role: isUserExist.role
    }
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: isUserExist.needsPasswordChange,
    };
};

const changePassword = async (user: JwtPayload, payload: { oldPassword: string, newPassword: string }) => {

    const isUserExist = await User.findOne({
        id: user.userId,
        role: user.role
    });

    if (!isUserExist) {
        throw new AppError(400, 'User not FOUNDED!');
    };
    if (isUserExist?.isDeleted === true) {
        throw new AppError(400, 'User is DELETED!');
    };
    if (isUserExist?.status === 'blocked') {
        throw new AppError(403, 'User is BLOCKED!');
    };
    if (isUserExist?.password !== payload.oldPassword) {
        throw new AppError(403, 'Password not matched!');
    };

    const result = await User.findOneAndUpdate(
        {
            id: user.userId,
            role: user.role
        },
        {
            password: payload.newPassword,
            needsPasswordChange: false
        }
    )

    if (!result) {
        throw new AppError(403, 'Something went wrong');
    }

    const jwtPayload = {
        userId: isUserExist.id,
        role: isUserExist.role
    }
    const accessToken = jwt.sign(
        jwtPayload,
        config.jwt_access_secret as string,
        {
            expiresIn: '10d'
        }
    );

    return null;

};

const refreshToken = async (token: string) => {
    if (!token) {
        throw new AppError(401, 'You are not a valid user for get access!');
    };



    // checking if the token is valid or not
    const decoded = jwt.verify(token, config.jwt_refresh_secret as string) as JwtPayload;

    const { userId } = decoded;

    const isUserExist = await User.findOne({
        id: userId
    });

    const jwtPayload = {
        userId: isUserExist?.id,
        role: isUserExist?.role
    }
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    );

    return {
        accessToken
    };
};

const forgetPassword = async (id: string) => {
    const isUserExist = await User.findOne({
        id: id
    });

    if (!isUserExist) {
        throw new AppError(400, 'User not found!');
    };

    //  Check more is the user deleted/blocked

    const jwtPayload = {
        userId: isUserExist?.id,
        role: isUserExist?.role
    }
    const resetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        '10m'
    );

    const resetUILink = `http://localhost:3000?id=${id}&token=${resetToken}`;

    sendEmail();

    console.log(resetUILink);
};


export const authServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword
};