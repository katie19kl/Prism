import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Gender } from '../common/gender.enum';


export function IsGender(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isGender',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                
                    // you can return a Promise<boolean> here as well, if you want to make async validation
                    return (typeof value === 'string') && ((value == Gender.Male) || (value == Gender.Female)) 
                },
            },
        });
    };
}