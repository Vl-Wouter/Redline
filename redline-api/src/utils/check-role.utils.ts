import { User } from 'src/users/user.entity';
import { UserRole } from 'src/users/user-role.enum';

export const checkModOrAdmin = (user: User) => {
  return (
    user.roles.includes(UserRole.ADMIN) ||
    user.roles.includes(UserRole.MODERATOR)
  );
};
