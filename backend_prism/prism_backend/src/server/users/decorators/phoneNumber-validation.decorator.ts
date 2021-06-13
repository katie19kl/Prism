import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Role } from 'src/server/RolesActivity/role.enum';


export function IsPhoneNumber(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isPhoneNumber',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                
                    // you can return a Promise<boolean> here as well, if you want to make async validation
                    if (typeof value === 'string') {
                        
                        if (value.length === 10) {
                            return true;
                        }

                    }

                    return false;
                },
            },
        });
    };
}