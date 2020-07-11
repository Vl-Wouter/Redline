import { UserRole } from '../users/user-role.enum';

export interface JwtPayload {
  id: number;
  username: string;
  roles: UserRole[];
  fullName: string;
}
