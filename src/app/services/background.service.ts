import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  private apiUrl = 'http://localhost/KANBAN-BOARD/kanban/kanban-board-api/';

  constructor(private http: HttpClient) {}

  updateBackground(email: string, newBackground: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}update_background.php`, { email, newBackground });
  }
}
