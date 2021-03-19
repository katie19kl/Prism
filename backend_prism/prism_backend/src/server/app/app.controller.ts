import { Controller, Get, Post, UseFilters, UseGuards } from '@nestjs/common';
import { MainJWTFilter } from '../auth/filters/MainJWTFilter.filter';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { Role } from '../TRY_ROLES/role.enum';
import { hasRoles } from '../TRY_ROLES/roles.decorator';
import { RolesGuard } from '../TRY_ROLES/roles.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post("hello")
    @hasRoles(Role.Admin)
    @UseGuards(RolesGuard)
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


