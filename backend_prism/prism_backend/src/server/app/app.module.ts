import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '.././auth/auth.module';
import { UsersModule } from '.././users/users.module';
import { AdminRolesGuard } from '../RolesActivity/admin_roles.guard';
import { FileHandlingModule } from '../file-handling/file-handling.module';
import { UserSubmissionModule } from '../UserSubmission/user-submission.module'
//import { ReviewModule } from '../review/review.module';

@Module({
  imports: [
    UserSubmissionModule,
    //ReviewModule,
    AuthModule, 
    UsersModule,
    FileHandlingModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-prism-project')
  ],
  controllers: [AppController],
  providers: [AppService, AdminRolesGuard],
})
export class AppModule {}