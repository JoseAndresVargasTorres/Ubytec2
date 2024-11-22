import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private readonly SERVICE_ID = 'service_gy285dh';
  private readonly TEMPLATE_ID = 'template_x4ptk24';
  private readonly PUBLIC_KEY = 'xC-veuEjAvJkMVrud';

  constructor() {
    // Inicializar EmailJS con la Public Key
    emailjs.init(this.PUBLIC_KEY);
  }

  async sendPasswordByEmail(nombre: string, email: string, password: string): Promise<void> {
    try {
      await emailjs.send(
        "service_gy285dh",           // Tu Service ID
        "template_x4ptk24",          // Tu Template ID
        {
          to_name: nombre,
          password: password,
          to_email: email
        }
      );
      console.log('Email enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el email:', error);
      throw error;
    }
  }
}
