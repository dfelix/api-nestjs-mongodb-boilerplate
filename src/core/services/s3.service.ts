import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  async uploadFile(file: Express.Multer.File, path?: string, name?: string) {
    const { originalname } = file;
    const fileName = name
      ? name + `.${originalname.split('.').pop()}`
      : originalname;
    const filePath = path ? path + `/${fileName}` : fileName;

    return this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      filePath,
      file.mimetype,
    );
  }

  async deletePath(path?: string) {
    // const listParams = {
    //   Bucket: bucket,
    //   Prefix: dir,
    // };
    // const listedObjects = await s3.listObjectsV2(listParams).promise();
    // if (listedObjects.Contents.length === 0) return;
    // const deleteParams = {
    //   Bucket: bucket,
    //   Delete: { Objects: [] },
    // };
    // listedObjects.Contents.forEach(({ Key }) => {
    //   deleteParams.Delete.Objects.push({ Key });
    // });
    // await s3.deleteObjects(deleteParams).promise();
    // if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
  }

  private async s3_upload(
    buffer: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: buffer,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'eu-central-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return { url: s3Response.Location };
    } catch (e) {
      throw e;
    }
  }
}
