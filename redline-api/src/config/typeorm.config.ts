import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { constantsConfig as config } from './constants.config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.NODE_ENV === 'production' ? 'mariadb' : 'mysql',
  host: config.db.host,
  username: config.db.username,
  password: config.db.password,
  port: config.db.port,
  database: config.db.dbName,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
