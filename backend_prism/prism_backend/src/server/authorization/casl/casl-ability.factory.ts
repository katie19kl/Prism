import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "src/server/users/dto/create-user.dto";
import { IUser } from "src/server/users/iuser.interface";
import { Action } from "../action.enum";
import { Role } from "../role.enum";

type Subjects = InferSubjects<typeof CreateUserDto> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: IUser) {
        
        const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>
            (Ability as AbilityClass<AppAbility>);

        if (user.role === Role.Admin) {

            can(Action.Manage, 'all'); // read-write access to everything
        
        } else if (user.role === Role.Commander) {
            
            can(Action.Create, CreateUserDto);
        
        } else {
        
            can(Action.Read, 'all'); // read-only access to everything
        
        }

        // soldier won't be able to create users.
        cannot(Action.Create, CreateUserDto);

        return build({
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
        });
    }
}