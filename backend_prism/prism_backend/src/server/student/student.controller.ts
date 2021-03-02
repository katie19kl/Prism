import { Controller, Get, Param, Post, Body, BadRequestException } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './interfaces/student.interface';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('student')
export class StudentController {
  	constructor(private readonly studentService: StudentService) {}

  	@Post()
  	async create(@Body() createStudentDto: CreateStudentDto) {
    	this.studentService.create(createStudentDto);
  	}

  	@Get()
  	async getAllStudents(): Promise<Student[]> {
    	return this.studentService.getAllStudents();
  	}

  	@Get(':id')
  	async findOne(@Param('id') id: string): Promise<Student> {

    	const student: Student = await this.studentService.findOne(id);

    	if (student === null) {
      		throw new BadRequestException("Invalid User");
    	}
		else {
			return student;
		}
  	}
}
