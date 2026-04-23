import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  /**
   * Build a jsPDF document from text without saving it.
   * Returns the doc instance so callers can export as needed.
   */
  private buildPdfDoc(text: string, fileName: string = 'document'): jsPDF {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;
    const lineHeight = 7;
    let cursorY = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(fileName, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 12;

    doc.setDrawColor(129, 57, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(text, maxLineWidth);
    for (const line of lines) {
      if (cursorY + lineHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    }

    return doc;
  }

  /**
   * Generate the HTML string for the given text content.
   * Returns the raw HTML string without triggering a download.
   */
  generateHtmlString(text: string, fileName: string = 'document'): string {
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f9f5ff;
      color: #312639;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 24px rgba(129, 57, 235, 0.12);
      border: 1px solid #eee;
    }
    h1 {
      color: #8139eb;
      font-size: 1.8rem;
      margin-bottom: 12px;
      text-align: center;
    }
    .separator {
      width: 60px;
      height: 4px;
      background: linear-gradient(135deg, #8139eb, #bd00cb);
      margin: 0 auto 24px;
      border-radius: 4px;
    }
    .meta {
      text-align: center;
      color: #888;
      font-size: 0.85rem;
      margin-bottom: 24px;
    }
    .content {
      line-height: 1.8;
      font-size: 1rem;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .container { box-shadow: none; border: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${fileName}</h1>
    <div class="separator"></div>
    <div class="meta">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    <div class="content">${escapedText}</div>
  </div>
</body>
</html>`;
  }

  /**
   * Generate PDF content as a base64 data URI string (without saving).
   */
  generatePdfDataUri(text: string, fileName: string = 'document'): string {
    return this.buildPdfDoc(text, fileName).output('datauristring');
  }

  /**
   * Generate PDF content as a Blob (without saving).
   */
  generatePdfBlob(text: string, fileName: string = 'document'): Blob {
    return this.buildPdfDoc(text, fileName).output('blob') as unknown as Blob;
  }

  /**
   * Download text content as a styled PDF file.
   */
  downloadAsPdf(text: string, fileName: string = 'document'): void {
    const doc = this.buildPdfDoc(text, fileName);
    doc.save(`${fileName}.pdf`);
  }

  /**
   * Download text content as a styled HTML file.
   */
  downloadAsHtml(text: string, fileName: string = 'document'): void {
    const html = this.generateHtmlString(text, fileName);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${fileName}.html`;
    anchor.click();

    URL.revokeObjectURL(url);
  }
}
