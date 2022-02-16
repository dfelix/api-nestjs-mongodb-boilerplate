import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './services/storage.service';
import { S3Service } from 'src/core/services/s3.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService, S3Service],
})
export class StorageModule {}
