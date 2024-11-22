import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() {
    emailjs.init('R-Y8plTXgo_X4GbnR'); // Initialize EmailJS with your user ID
  }

  async sendEmail(templateParams: any): Promise<EmailJSResponseStatus> {
    try {
      const response = await emailjs.send('service_t11r7ti', 'template_vnh63em', templateParams);
      return response;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}