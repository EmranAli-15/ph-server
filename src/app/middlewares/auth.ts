import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";


const auth = () => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization;

            // is the token send from the client
            if (!token) {
                throw new AppError(401, 'You are not a valid user for get access!');
            };

            // checking if the token is valid or not
            jwt.verify(token, config.jwt_access_secret as string, function (error, decoded) {
                if (error) {
                    throw new AppError(401, 'You are not authorized!');
                };

                req.user = decoded as JwtPayload;
                next();
            });

        }
    );
};

export default auth;