import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectsOnDemandSchema } from './subjects-on-demand.schema';
import { SubjectsOnDemandController } from './subjects-on-demand.controller';
import { SubjectsOnDemandService } from './subjects-on-demand.service';


@Module({
    controllers: [ SubjectsOnDemandController ],
    providers: [ SubjectsOnDemandService ],
    exports: [SubjectsOnDemandService],
    imports: [
        MongooseModule.forFeature([{ name: 'Subjects-On-Demand', schema: SubjectsOnDemandSchema }])
	],
})
export class SubjectsOnDemandModule {}
