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
                    if (Array.isArray(value)) {

                        for (let i = 0; i < value.length; i++) {
                      
                            if ((value[i] !== Major.Firmware) && (value[i] !== Major.Research) 
                                && (value[i] !== Major.Software) && (value[i] !== Major.Validation)) {

                                // Contains invalid major.
                                return false;
                            }
                        }
                        
                        return true;
                    } else {

                        // Not an array.
                        return false; 
                    }
                },
            },
        });
    };
}