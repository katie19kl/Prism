import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { IReview } from './ireview.interface';

@Injectable()
export class ReviewService {

    constructor(@InjectModel('Reviews') private userSubmissionModel: Model<IReview>) {}

    async create(createReviewDto: CreateReviewDto) {
        
    }

}
