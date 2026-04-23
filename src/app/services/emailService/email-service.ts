import { Injectable, inject } from '@angular/core';
import emailjs from '@emailjs/browser';
import { DownloadService } from '../downloadService/download-service';

export interface OrderConfirmationParams {
  customerEmail: string;
  customerName: string;
  orderId: number;
  orderDate: string;
  orderTotal: number;
  currencyCode: string;
  items: OrderPromptItem[];
  siteName?: string;
  siteType?: string;
}

export interface OrderPromptItem {
  productName: string;
  platformName: string | null;
  prompt: string | null;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private downloadService = inject(DownloadService);

  // ── EmailJS credentials (same account used by the contact form) ──
  private readonly SERVICE_ID = 'gmail_service';
  private readonly TEMPLATE_ID = 'template_order_confirm'; // create this in your EmailJS dashboard
  private readonly PUBLIC_KEY = 'Jxe0Vhystdvy0tqUk';

  /**
   * Send a "Thank you for purchasing" confirmation email to the customer.
   * The email body contains all purchased prompts as readable text and
   * includes download links (data URIs) so the customer can save the
   * prompts as a PDF or HTML file directly from their inbox.
   */
  async sendOrderConfirmation(params: OrderConfirmationParams): Promise<void> {
    const fileName = `Order-${params.orderId}-Prompts`;

    // Combine all prompt texts into one document
    const combinedText = params.items
      .map((item, i) => {
        const header = `${i + 1}. ${item.productName}${item.platformName ? ' · ' + item.platformName : ''}`;
        const divider = '-'.repeat(header.length);
        return `${header}\n${divider}\n${item.prompt ?? '(Prompt not available)'}`;
      })
      .join('\n\n\n');

    // Generate base64 PDF data URI
    const pdfDataUri = this.downloadService.generatePdfDataUri(combinedText, fileName);

    // Generate base64 HTML data URI
    const htmlString = this.downloadService.generateHtmlString(combinedText, fileName);
    const htmlBase64 = btoa(unescape(encodeURIComponent(htmlString)));
    const htmlDataUri = `data:text/html;charset=utf-8;base64,${htmlBase64}`;

    // Build the list of prompts for the email body (rendered as HTML in the template)
    const promptsHtml = params.items
      .map(
        (item) => `
        <div style="margin-bottom:24px;padding:20px;border-radius:10px;border:1px solid #e8d5ff;background:#faf5ff;">
          <h3 style="margin:0 0 4px;color:#8139eb;font-size:1rem;">
            ${this._esc(item.productName)}
            ${item.platformName ? `<span style="font-weight:400;color:#888;font-size:0.85rem;"> · ${this._esc(item.platformName)}</span>` : ''}
          </h3>
          <pre style="margin:12px 0 0;white-space:pre-wrap;word-break:break-word;font-family:inherit;font-size:0.92rem;line-height:1.7;color:#312639;">${this._esc(item.prompt ?? '(Prompt not available)')}</pre>
        </div>`,
      )
      .join('');

    // בתוך פונקציית sendOrderConfirmation או sendOrderEmail
const templateParams = {
  to_email: params.customerEmail,
  customer_name: params.customerName,
  order_number: String(params.orderId),
  order_date: params.orderDate,
  order_total: `${params.orderTotal.toFixed(2)} ${params.currencyCode}`,
  
  // הוספת הנתונים החדשים
  site_name: params.siteName, // וודא שאתה מעביר את זה ב-Params
  site_type: params.siteType, // למשל: 'Landing Page', 'E-commerce'
  
  prompts_html: promptsHtml, // זה כבר כולל את פירוט המוצרים והפרומפטים
  pdf_download_link: pdfDataUri,
  html_download_link: htmlDataUri,
  pdf_file_name: `${fileName}.pdf`,
  html_file_name: `${fileName}.html`,
};

    await emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, templateParams, this.PUBLIC_KEY);
  }

  private _esc(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
