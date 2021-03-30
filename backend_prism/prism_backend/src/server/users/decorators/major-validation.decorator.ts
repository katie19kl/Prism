import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Major } from '../common/major.enum';


export function IsMajor(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isMajor',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                
                    // you can return a Promise<boolean> here as well, if you want to make async validation
                    return (typeof value === 'string') && ((value == Major.Firmware) || (value == Major.Research)
                            || (value == Major.Software) || (value == Major.Validation)) 
                },
            },
        });
    };
}