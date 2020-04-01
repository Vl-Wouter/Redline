import { User } from 'src/auth/user.entity';
import { UserRole } from 'src/auth/user-role.enum';

export const checkModOrAdmin = (user: User) => {
  return (
    user.roles.includes(UserRole.ADMIN) ||
    user.roles.includes(UserRole.MODERATOR)
  );
};
