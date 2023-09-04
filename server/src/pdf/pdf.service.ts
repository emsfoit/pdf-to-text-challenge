import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';

@Injectable()
export class PdfService {
  // Convert pdf to text
  async convertPdfToText(fileBuffer: Buffer) {
    try {
      const data = await pdf(fileBuffer);
      return data.text;
    } catch (error) {
      console.error('Error converting PDF to text:', error);
      throw error; // Rethrow the error to handle it in the caller
    }
  }
}
