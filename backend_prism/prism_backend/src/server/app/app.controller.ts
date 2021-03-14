import { Controller, Get, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("hello")
    getHello(): string {
        console.log("hello from server!")
        return this.appService.getHello();
    }
}