import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/core/services/s3.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  constructor(private s3Service: S3Service) {}

  async uploadFile(file: Express.Multer.File, path?: string, name?: string) {
    const fileName = name ? name : uuidv4();
    return this.s3Service.uploadFile(file, path, fileName);
  }
}
