import { Controller, Get, Post, SetMetadata, UseFilters, UseGuards } from '@nestjs/common';
import { MainJWTFilter } from '../auth/filters/MainJWTFilter.filter';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { Role } from '../RolesActivity/role.enum';
import { AppService } from './app.service';
import { Role_Guard } from '../RolesActivity/Role_Guard.guard';



@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}


    @Post("fooPidor")
    @SetMetadata('roles', [Role.Admin,Role.Soldier])
    @UseGuards(Role_Guard)
    getFooGUARD(): string {
        console.log("netoooo try ")
        return "netoo try"
    }



}


