import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';


export const ROLES_KEY = 'roles';
export const hasRoles = (...hasRoles: Role[]) => SetMetadata(ROLES_KEY, hasRoles);