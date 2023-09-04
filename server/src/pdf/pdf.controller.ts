import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { PdfService } from './pdf.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pdf')
export class PdfController {
  constructor(private pdfService: PdfService) {}

  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async convertPdfToText(@UploadedFile(new ParseFilePipe({
    validators: [new FileTypeValidator({ fileType: 'application/pdf'})],
  })) file: Express.Multer.File) {
    return this.pdfService.convertPdfToText(file.buffer);
  }
}
