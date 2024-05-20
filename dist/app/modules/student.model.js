"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = void 0;
const mongoose_1 = require("mongoose");
const userNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        validate: {
            validator: function (str) {
                const firstNameStr = str.charAt(0).toUpperCase() + str.slice(1);
                return firstNameStr === str;
            },
            message: "{VALUE} is not required"
        }
    },
    middleName: { type: String },
    lastName: { type: String, required: true },
});
const guardianSchema = new mongoose_1.Schema({
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherContactNo: { type: String, required: true },
});
const localGuardianSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
});
const studentSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: {
        type: userNameSchema,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    dateOfBirth: { type: String },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
        type: String,
        enum: {
            values: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"],
            message: "BLOOD IS REQUIRED BROH",
        },
        required: true,
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
        type: guardianSchema,
        required: true,
    },
    localGuardian: {
        type: localGuardianSchema,
        required: true,
    },
    profileImg: { type: String },
    isActive: {
        type: String,
        enum: ["active", "blocked"],
        default: "active",
    },
});
exports.StudentModel = (0, mongoose_1.model)('Student', studentSchema);
