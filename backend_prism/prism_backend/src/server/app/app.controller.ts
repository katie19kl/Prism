import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { MainJWTFilter } from '../auth/filters/MainJWTFilter.filter';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("hello")
    getHello(): string {
        console.log("hello from server!")
        return this.appService.getHello();
    }

    @Get("main_page")
    @UseGuards(JwtAuthGuard)
    @UseFilters(MainJWTFilter)
    mainPageStudent(): string {
        console.log("AZOR ISHI OF USER")
        return "AZOR ISHI OF USER"
    }

}


