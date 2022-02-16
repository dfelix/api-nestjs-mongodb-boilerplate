import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadSingleFileDto } from './dto/upload-single-file.dto';
import { Express } from 'express';
import { StorageService } from './services/storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadFile(
    @Body() body: UploadSingleFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.storageService.uploadFile(file, body.path, body.name);
  }
}
