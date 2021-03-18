import { Role } from "src/server/authorization/role.enum";

export class CreateUserDto {
    readonly username: string;
    readonly password: string;
    readonly role: Role;
}