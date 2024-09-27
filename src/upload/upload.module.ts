import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as moment from 'moment';
import { extname } from 'path';
import { mkdirSync } from 'fs-extra';
import { generate } from 'randomstring';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Upload
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const nowFormat = moment().format('YYYY/MM/DD');
          const directory = nowFormat;
          mkdirSync('uploads/' + directory, {
            recursive: true,
          });

          const extension = extname(file.originalname);
          const fileName = generate() + extension;

          cb(null, `${directory}/${fileName}`)
        }
      })
    })
  ],
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule {}
