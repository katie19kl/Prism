import { Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentDoc } from './interfaces/student-doc.interface';
import { Student } from './interfaces/student.interface';

@Injectable()
export class StudentService {

    constructor(@InjectModel('Student') private readonly studentModel: Model<StudentDoc>) {}

    async create(createStudentDTO: CreateStudentDto) {

        const newStudent = await new this.studentModel(createStudentDTO);
        return newStudent.save();
    }

    async getAllStudents(): Promise<Student[]> {
        const students = await this.studentModel.find().exec();

        return students;
    }

    async findOne(@Param('id') id: string) : Promise<Student> {
        const student = await this.studentModel.findOne({"personalId": id});

        return student;
    }
}
