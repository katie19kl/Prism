import { Controller, Get, Post, UseFilters, UseGuards } from '@nestjs/common';
import { MainJWTFilter } from '../auth/filters/MainJWTFilter.filter';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { Role } from '../RolesActivity/role.enum';
import { AdminRolesGuard } from '../RolesActivity/admin_roles.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post("hello")
    @UseGuards(AdminRolesGuard)
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


