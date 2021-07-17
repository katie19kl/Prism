import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';


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