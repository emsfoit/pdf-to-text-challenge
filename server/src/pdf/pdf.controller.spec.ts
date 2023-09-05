import { Test, TestingModule } from '@nestjs/testing';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service'; 
import * as fs from 'fs';
import * as path from 'path';

describe('Items Controller', () => {
  let controller: PdfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [PdfService], // Include PdfService in the providers
    }).compile();

    controller = module.get<PdfController>(PdfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should convert pdf to text', async () => {
    // Create a File object
    let file = fs.readFileSync(
      path.resolve(__dirname, '../test_data/test.pdf'),
    );
    // Convert the file to a buffer
    let buffer = Buffer.from(file);
    // Create a mock file object
    let mockFile: Express.Multer.File = {
      buffer: buffer,
      encoding: '7bit',
      fieldname: 'file',
      filename: 'test.pdf',
      mimetype: 'application/pdf',
      originalname: 'test.pdf',
      size: 0,
      stream: null,
      destination: '',
      path: '',
    };
    // Call the convertPdfToText method
    let result = await controller.convertPdfToText(mockFile);
    // Expect the result to be a string
    expect(typeof result).toBe('string');
    // Expect the result to contain the text from the pdf
    expect(result).toContain('Test');
  });
});
