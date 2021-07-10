import { Controller, Get, Post, UseFilters, UseGuards } from '@nestjs/common';
import { MainJWTFilter } from '../auth/filters/MainJWTFilter.filter';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { Role } from '../RolesActivity/role.enum';
import { AdminRolesGuard } from '../RolesActivity/admin_roles.guard';
import { AppService } from './app.service';
import { CommanderRolesGuard } from '../RolesActivity/commander_roles.guard';
import { TesterRolesGuard } from '../RolesActivity/tester_roles.guard';
import { SoldierRolesGuard } from '../RolesActivity/soldier_roles.guard';
import { AdminCommanderRolesGuard } from '../RolesActivity/admin_commander_roles.guard';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post("helloAdmin")
    @UseGuards(AdminRolesGuard)
    getHelloAdmin(): string {
        console.log("hello from admin server!")
        return "XUI admin"
    }


    @Post("helloCommander")
    @UseGuards(CommanderRolesGuard)
    getHelloCommander(): string {
        console.log("hello from commander server!")
        return "XUI commander"
    }

    
    @Post("helloTester")
    @UseGuards(TesterRolesGuard)
    getHelloTester(): string {
        console.log("hello from tester server!")
        return "XUI tester"
    }

    
    @Post("helloSoldier")
    @UseGuards(SoldierRolesGuard)
    getHelloSoldier(): string {
        console.log("hello from soldier server!")
        return "XUI soldier"
    }

    
    @Post("helloAdminCommander")
    @UseGuards(AdminCommanderRolesGuard)
    getHelloAdminCommander(): string {
        console.log("hello from AdminCommander")
        return "XUI admin/commander"
    }



}


