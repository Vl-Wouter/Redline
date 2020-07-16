import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from '../users/user.entity';
import { handleImage } from 'src/utils/file-upload.utils';
import { genSalt, hash } from 'bcrypt';
import { FollowRepository } from '../users/follow.repository';
import { promisify } from 'util';
import crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(FollowRepository)
    private followRepository: FollowRepository,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(createUserDTO: CreateUserDTO, profileImage): Promise<void> {
    return this.userRepository.signUp(createUserDTO, profileImage);
  }

  async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const result = await this.userRepository.validateUserPassword(
      authCredentialsDTO,
    );
    if (!result) throw new UnauthorizedException('Invalid credentials');

    const { id, username, roles, fullName } = result;

    const payload: JwtPayload = { id, username, roles, fullName };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async sendResetLink(req, { email }) {
    const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
    const found = await this.userRepository.findOne(
      { email },
      { select: ['id', 'email'] },
    );
    if (!found) throw new NotFoundException('Cannot find a user');

    found.resetToken = token;
    found.tokenExpires = new Date(Date.now() + 3600000);
    await found.save();

    await this.mailService.send({
      to: found.email,
      subject: 'Password reset',
      text: 'You have requested a password reset',
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:
        ${req.headers.origin}/reset/${token}</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    });
  }

  async getUserFromToken(token: string) {
    const found = await this.userRepository.findOne({
      where: [`resetToken = ${token} AND user.tokenExpires > ${Date.now()}`],
    });

    if (!found)
      throw new NotFoundException('Cannot find a user with this token');

    return found;
  }

  async resetPassword(token: string, update) {
    const found = await this.userRepository.findOne({
      select: ['id', 'password', 'salt', 'resetToken', 'tokenExpires'],
      where: [`resetToken = ${token} AND user.tokenExpires > ${Date.now()}`],
    });

    if (!found) throw new NotFoundException('Cannot find this user');

    const samePassword = await found.validatePassword(update.password);

    if (samePassword)
      throw new UnprocessableEntityException(
        'New password cannot be the same as the previous password',
      );

    delete found.resetToken;
    delete found.tokenExpires;
    await found.save();

    await this.userRepository.updateAccount(update, found);

    return this.mailService.send({
      to: found.email,
      subject: 'Password has been updated',
      text: `The password for ${found.email} on Redline has been updated.`,
    });
  }

  // MOVE BELOW TO USERS API

  async updateUserByName(username: string, userData, user: User) {
    const validPassword = userData.current_password
      ? user.validatePassword(userData.currentPassword)
      : true;
    delete userData.current_password;
    if (username !== user.username || !validPassword)
      throw new UnauthorizedException('You cannot update this profile');
    if (userData.password) {
      userData.salt = await genSalt();
      userData.password = await hash(userData.password, userData.salt);
      delete userData.confirm_password;
    }
    await this.userRepository.update({ username }, userData);
    return this.getAllUserDetails(username, user);
  }

  async updateUserAvatar(username: string, image, user) {
    console.log(username, image);
    if (username !== user.username)
      throw new UnauthorizedException('You cannot update this profile image');
    const profileImg = await handleImage(image.path, {
      width: 256,
      isSquare: true,
      dest: `uploads/users/${username}`,
      name: 'avatar',
      format: 'jpg',
    });
    console.log(profileImg);
    await this.userRepository.update({ username }, { profileImg });
    return this.getAllUserDetails(username, user);
  }

  async checkExisting(criteria) {
    const { field, value } = criteria;
    const found = await this.userRepository.findOne({ [field]: value });
    if (!found) return false;
    return true;
  }

  async getUserByName(username: string) {
    const found = await this.userRepository.findOne(
      { username },
      {
        select: [
          'id',
          'firstName',
          'lastName',
          'username',
          'roles',
          'profileImg',
        ],
        relations: [
          'attendingEvents',
          'ownEvents',
          'vehicles',
          'followed',
          'follows',
        ],
        join: {
          alias: 'user',
          leftJoinAndSelect: {
            attendingEvents: 'user.attendingEvents',
            eventData: 'attendingEvents.event',
            eventCategory: 'eventData.category',
            followed: 'user.followed',
            followerUsers: 'followed.follows',
          },
        },
      },
    );
    if (!found)
      throw new NotFoundException(
        `Cannot find a user with the username ${username}`,
      );
    return found;
  }

  async getAllUserDetails(username: string, user: User) {
    if (username !== user.username)
      throw new NotFoundException(`Cannot find user details`);
    return this.userRepository
      .createQueryBuilder('u')
      .where('u.username = :username', { username: username })
      .addSelect('u.email')
      .leftJoinAndSelect('u.ownEvents', 'events')
      .leftJoinAndSelect('events.category', 'eventCat')
      .leftJoinAndSelect('u.vehicles', 'v')
      .leftJoinAndSelect('u.followed', 'followed')
      .getOne();
  }

  async followUser(followId: number, user: User) {
    const userToFollow = await this.userRepository.findOne(followId);
    const follow = this.followRepository.create({
      leads: userToFollow,
      follows: user,
    });
    await follow.save();
    return this.getUserByName(userToFollow.username);
  }

  async unfollowUser(followId: number, user: User) {
    const userToUnfollow = await this.userRepository.findOne(followId);
    const relation = await this.followRepository.findOne({
      leads: userToUnfollow,
      follows: user,
    });
    await relation.remove();
    return this.getUserByName(userToUnfollow.username);
  }
}
