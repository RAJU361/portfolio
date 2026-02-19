import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Contact {

  openMail() {
    window.location.href = 'mailto:rajeshchouri361@gmail.com';
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  sendMail(name: string, email: string, message: string) {
    if (!name || !email || !message) {
      alert('Please fill all fields');
      return;
    }

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}`
    );
    
    window.location.href = `mailto:rajeshchouri361@gmail.com?subject=${subject}&body=${body}`;
  }
}