import { Component, signal, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../core/services/chatbot.service';
import { AuthService } from '../../core/services/auth.service';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  attachmentType?: 'imagen' | 'audio' | 'archivo';
  fileName?: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent implements AfterViewChecked {
  private chatbotService = inject(ChatbotService);
  private authService = inject(AuthService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages = signal<Message[]>([
    { sender: 'bot', text: '¡Hola! Soy el Asistente IA de URVASEO. ¿En qué puedo ayudarte hoy?' },
  ]);
  inputText = signal('');
  isBotTyping = signal(false);
  errorMessage = signal<string | null>(null);

  isRecording = signal(false);
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      // Ignore scroll errors
    }
  }

  toggleRecording(): void {
    if (this.isRecording()) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  private startRecording(): void {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.errorMessage.set('Su navegador no soporta grabación de audio.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
        
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const file = new File([audioBlob], 'audio-grabado.webm', { type: 'audio/webm' });

          this.messages.update(prev => [...prev, { 
            sender: 'user', 
            text: 'Mensaje de voz grabado',
            attachmentType: 'audio',
            fileName: 'audio-grabado.webm'
          }]);

          this.isBotTyping.set(true);
          this.errorMessage.set(null);

          const email = this.authService.userEmail();

          this.chatbotService.sendFile(email, file, 'audio').subscribe({
            next: (res) => {
              this.messages.update(prev => [...prev, { sender: 'bot', text: res.reply }]);
              this.isBotTyping.set(false);
            },
            error: () => {
              this.errorMessage.set('Error al enviar el mensaje de voz.');
              this.isBotTyping.set(false);
            },
          });

          // Release the microphone
          stream.getTracks().forEach(track => track.stop());
        };

        this.mediaRecorder.start();
        this.isRecording.set(true);
        this.errorMessage.set(null);
      })
      .catch(err => {
        console.error('Error al acceder al micrófono:', err);
        this.errorMessage.set('Permiso de micrófono denegado o no disponible.');
      });
  }

  private stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording.set(false);
    }
  }

  sendMessage(): void {
    const text = this.inputText().trim();
    if (!text) return;

    // Add user message
    this.messages.update(prev => [...prev, { sender: 'user', text }]);
    this.inputText.set('');
    this.isBotTyping.set(true);
    this.errorMessage.set(null);

    const email = this.authService.userEmail();
    const name = this.authService.userNombre();

    this.chatbotService.sendText(email, name, text).subscribe({
      next: (res) => {
        this.messages.update(prev => [...prev, { sender: 'bot', text: res.reply }]);
        this.isBotTyping.set(false);
      },
      error: () => {
        this.errorMessage.set('Error de conexión con el Asistente IA.');
        this.isBotTyping.set(false);
      },
    });
  }

  onFileSelected(event: Event, type: 'imagen' | 'audio' | 'archivo'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    
    // Add user message displaying the attached file
    this.messages.update(prev => [...prev, { 
      sender: 'user', 
      text: `Archivo enviado: ${file.name}`,
      attachmentType: type,
      fileName: file.name
    }]);

    this.isBotTyping.set(true);
    this.errorMessage.set(null);

    const email = this.authService.userEmail();

    this.chatbotService.sendFile(email, file, type).subscribe({
      next: (res) => {
        this.messages.update(prev => [...prev, { sender: 'bot', text: res.reply }]);
        this.isBotTyping.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al enviar el archivo adjunto.');
        this.isBotTyping.set(false);
      },
    });

    // Reset input value to allow selecting the same file again
    input.value = '';
  }
}
