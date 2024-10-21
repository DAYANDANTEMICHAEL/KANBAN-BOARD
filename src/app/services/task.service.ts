import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private taskStatusCache: { [taskId: number]: string } = {};
    private apiUrl = 'http://localhost/KANBAN-BOARD/kanban/kanban-board-api/';

    constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }

    getTasks(): Observable<any> {
        console.log('Fetching tasks from server');
        console.log('Get tasks URL:', `${this.apiUrl}tasks`);
        console.log('Token:', this.authService.getToken());
        return this.http.get(`${this.apiUrl}tasks`, { headers: this.getHeaders(), withCredentials: true }).pipe(
            catchError(this.handleError),
            tap(response => console.log('Tasks fetched:', response))
        );
    }

    updateTask(task: Task): Observable<any> {
        console.log('Updating task:', task);
        return this.http.post(`${this.apiUrl}tasks-update`, task, { headers: this.getHeaders(), withCredentials: true }).pipe(
            catchError(this.handleError),
            tap(response => console.log('Task updated:', response))
        );
    }

    getTaskStatus(taskId: number): Promise<string> {
        console.log('Fetching status for task with ID:', taskId);
        return this.http.get(`${this.apiUrl}tasks-status?taskId=${taskId}`, { headers: this.getHeaders(), withCredentials: true })
            .toPromise()
            .then((response: any) => {
                console.log('Status fetched for task:', response);
                if (response && response.status) {
                    return response.status;
                } else {
                    return 'Unknown';
                }
            });
    }

    createTask(task: Task): Observable<any> {
        console.log('Creating task:', task);
        return this.http.post(`${this.apiUrl}tasks-create`, task, { headers: this.getHeaders(), withCredentials: true }).pipe(
            catchError(this.handleError),
            tap(response => console.log('Task created:', response))
        );
    }

    deleteTask(taskId: number, userId: number): Observable<any> {
        console.log(`Deleting task with ID: ${taskId}`);
        return this.http.post(`${this.apiUrl}tasks-delete`, { id: taskId, user_id: userId }, { headers: this.getHeaders(), withCredentials: true }).pipe(
            catchError(this.handleError),
            tap(response => console.log('Task deleted:', response))
        );
    }

    // getTaskStatus(taskId: number): Promise<string> {
    //     console.log('Fetching status for task with ID:', taskId);
    //     return this.http.get(`${this.apiUrl}tasks-status?taskId=${taskId}`, { headers: this.getHeaders() })
    //         .toPromise()
    //         .then((response: any) => {
    //             console.log('Status fetched for task:', response);
    //             if (response && response.status) {
    //                 return response.status;
    //             } else {
    //                 return 'Unknown';
    //             }
    //         });
    // }

    readOneTask(taskId: number): Observable<any> {
        console.log('Fetching task with ID:', taskId);
        return this.http.get(`${this.apiUrl}tasks-read?taskId=${taskId}`, { headers: this.getHeaders(), withCredentials: true }).pipe(
            catchError(this.handleError),
            tap(response => console.log('Task fetched:', response))
        );
    }

    getCurrentTaskStatus(taskId: number, userId: number): Promise<string> {
        console.log('Fetching current status for task with ID:', taskId);
        return this.http.get(`${this.apiUrl}tasks-status?taskId=${taskId}&userId=${userId}`, { headers: this.getHeaders(), withCredentials: true })
            .toPromise()
            .then((response: any) => {
                console.log('Current status fetched for task:', response);
                if (response && response.status) {
                    return response.status;
                } else {
                    return 'Unknown'; // or some default value
                }
            });
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

    
    
}