import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            
            // if expired was obtained => 401 Unauthorized
            ignoreExpriration: false,
            secret: jwtConstants.secret,
            // symmetric key for signing the token
            secretOrKey: 'thisismykickasssecretthatiwilltotallychangelater'
            
        });
    }

    async validate(payload: JwtPayload) {

        console.log("I am in validate");
        const user = await this.authService.validateUserByJwt(payload);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}