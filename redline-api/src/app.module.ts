import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { CategoriesModule } from './categories/categories.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MulterModule.register({
      dest: './uploads',
    }),
    EventsModule,
    AuthModule,
    CategoriesModule,
    VehiclesModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
