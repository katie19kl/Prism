import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Role } from 'src/server/RolesActivity/role.enum';


export function IsRole(validationOptions?: ValidationOptions) {

    return function (object: Object, propertyName: string) {

        registerDecorator({
            name: 'isRole',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                
                    // you can return a Promise<boolean> here as well, if you want to make async validation
                    return (typeof value === 'string') && ((value == Role.Admin) || (value == Role.Commander)
                        || (value == Role.Soldier) || (value == Role.Tester)) ;
                },
            },
        });
    };
}