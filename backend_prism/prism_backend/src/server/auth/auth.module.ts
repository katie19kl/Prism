import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConstants } from '../RolesActivity/constants';

@Module({
    exports: [AuthService, JwtModule],
    
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt', session: false }),
        JwtModule.register({
        
        secretOrPrivateKey: 'thisismykickasssecretthatiwilltotallychangelater',
        //secretOrPrivateKey : jwtConstants.secret,
        //secret: jwtConstants.secret,
        signOptions: {
            expiresIn: '30000s'
        }
        }),
        UsersModule,
        PassportModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy,LocalStrategy]
})
export class AuthModule {}