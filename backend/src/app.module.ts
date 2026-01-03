import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AuctionModule } from './auction/auction.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoryModule,
    AuctionModule,
    StorageModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
