import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from '../review/review.schema';
import { SubjectsOnDemandSchema } from '../subjects-on-demand/subjects-on-demand.schema';
import { UserSubmissionSchema } from '../UserSubmission/userSubmission.schema';
import { Synchronizer } from './Synchronizer';


@Module({

    imports: [
        MongooseModule.forFeature([{name: 'Subjects-On-Demand', schema: SubjectsOnDemandSchema}]),
        MongooseModule.forFeature([{name: 'Reviews', schema: ReviewSchema}]),
        MongooseModule.forFeature([{name: 'User-Submission', schema: UserSubmissionSchema}]),
    ],
    providers: [Synchronizer ],
    exports: [Synchronizer],
})
export class SynchronizerModule {}
