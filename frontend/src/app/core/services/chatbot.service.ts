import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatReply {
  reply: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private http = inject(HttpClient);
  private webhookUrl = environment.n8nBotWebhook;

  sendText(username: string, name: string, text: string): Observable<ChatReply> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      username: username,
      type: 'texto',
    });

    const body = {
      username,
      name,
      type: 'texto',
      text,
    };

    return this.http.post<ChatReply>(this.webhookUrl, body, { headers });
  }

  sendFile(username: string, file: File, type: 'imagen' | 'audio' | 'archivo'): Observable<ChatReply> {
    const headers = new HttpHeaders({
      username: username,
      type: type,
    });

    const formData = new FormData();
    formData.append('data', file);

    return this.http.post<ChatReply>(this.webhookUrl, formData, { headers });
  }
}
