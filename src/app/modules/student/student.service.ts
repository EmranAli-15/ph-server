import { StudentModel } from "./student.model";
import { Student } from "./student.interface";

const createStudentIntoDB = async (student: Student) => {
    const result = await StudentModel.create(student);
    return result;
};

const getAllStudentsFromDB = async () => {
    const result = await StudentModel.find();
    return result;
};

const getAStudentFromDB = async (id: string) => {
    const result = await StudentModel.findOne({ id: id });
    return result;
};

export const StudentService = {
    createStudentIntoDB,
    getAllStudentsFromDB,
    getAStudentFromDB,
}