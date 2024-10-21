import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    apiUrl = 'http://localhost/KANBAN-BOARD/kanban/kanban-board-api/';
    private token: string = '';
    private userId: number | undefined;
    private role: string | undefined;
    private firstName: string | undefined;
    private lastName: string | undefined;
    private avatar: string | undefined;
    private background: string | undefined;
  
    constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object,
      private router: Router
    ) {
      if (isPlatformBrowser(this.platformId)) {
        this.token = localStorage.getItem('token') || '';
        this.userId = parseInt(localStorage.getItem('userId') || '', 10);
        this.role = localStorage.getItem('role') || '';
        this.firstName = localStorage.getItem('firstName') || ''; 
        this.lastName = localStorage.getItem('lastName') || ''; 
        this.avatar = localStorage.getItem('avatar') || '';
        this.background = localStorage.getItem('background')|| '';
        console.log(
          'Constructor - Token:',
          this.token,
          'UserId:',
          this.userId,
          'Role:',
          this.role,
          'FirstName:',
          this.firstName,
          'LastName:',
          this.lastName,
          'avatar:',
          this.avatar,
          'background:',
          this.background
        );
      }
    }



    // Fetch Data
  
    getUserId(): number {
      if (!this.userId) {
        throw new Error('User ID is not set');
      }
      return this.userId;
    }
  
    setUserId(userId: number): void {
      this.userId = userId;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('userId', userId.toString());
        console.log('setUserId - UserId set:', this.userId);
      }
    }
    
    getd(): number {
      if (!this.userId) {
        throw new Error('User ID is not set');
      }
      return this.userId;
    }

    getRole(): string | undefined {
      return this.role;
    }
  
    setRole(role: string): void {
      this.role = role;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('role', role);
        console.log('setRole - Role set:', this.role);
      }
    }
  
    // Mock method to get user first name
    getfirstName(): string {
      // Replace with actual implementation, e.g., fetch from API or local storage
      return localStorage.getItem('firstName') || '';
    }

    setFirstName(firstName: string): void {
      this.firstName = firstName;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('firstName', firstName);
        console.log('setFirstName - FirstName set:', this.firstName);
      }
    }
  
    // Mock method to get user last name
    getlastName(): string {
      // Replace with actual implementation, e.g., fetch from API or local storage
      return localStorage.getItem('lastName') || '';
    }
  
    
    
    setLastName(lastName: string): void {
      this.lastName = lastName;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('lastName', lastName);
        console.log('setLastName - LastName set:', this.lastName);
      }
    }
    

    getavatar(): string{
      return localStorage.getItem('avatar') || '';
    }

    setavatar(avatar: string): void {
      this.avatar = avatar;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('avatar', avatar);
        console.log('setavatar - Avatar set:', this.avatar);
      }
    }
    

    getbackground(): string {
      return localStorage.getItem('background')  || '';
    }

    setbackground(background: string): void {
      this.background = background;
      if (isPlatformBrowser(this.platformId))  {
        localStorage.setItem('background', background);
        console.log('setbackground - Background set:', this.background);
      }
    }

    updateBackground(email: string, newBackground: string): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
    
      const data = { email, newBackground }; 
      return this.http.post(`${this.apiUrl}update-background`, data, { headers });
    }
    
    

    
    login(email: string, password: string): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
    
      const data = { email, password };
      const json = JSON.stringify(data);
    
      return this.http
        .post<any>(`${this.apiUrl}login`, json, {
          headers: headers,
          withCredentials: true,
        })
        .pipe(
          tap((response) => {
            if (
              response &&
              response.token &&
              response.user_id &&
              response.role &&
              response.avatar &&
              response.background &&
              response.first_name &&
              response.last_name 
            ) {
              this.setToken(response.token);
              this.setUserId(response.user_id);
              this.setRole(response.role);
              this.setavatar(response.avatar);
              this.setbackground(response.background);
              
              // Set firstName and lastName
              this.setFirstName(response.first_name);
              this.setLastName(response.last_name);
              
              console.log(
                'login - Token:',
                response.token,
                'UserId:',
                response.user_id,
                'Role:',
                response.role,
                'Avatar:',
                response.background,
                'Background:',
                response.avatar,
                'firstName:',
                response.first_name,
                'lastName:',
                response.last_name
              );
            }
          })
        );
    }
  
    // HANDLES REGISTRATION
  
    register(
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      middleName: string
    ): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      const data = { email, password, firstName, lastName, middleName };
      const json = JSON.stringify(data);
  
      return this.http.post(`${this.apiUrl}register`, json, {
        headers: headers,
        withCredentials: true,
      });
    }
  
    // HANDLES LOG OUT
    logout(): Observable<any> {
      return this.http
        .post(`${this.apiUrl}logout`, {}, { withCredentials: true })
        .pipe(
          tap(() => {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              localStorage.removeItem('firstName');
              localStorage.removeItem('lastName');
              localStorage.removeItem('role');
              localStorage.removeItem('avatar');
              localStorage.removeItem('background');
            }
            this.token = '';
            this.userId = undefined;
            this.role = undefined;
            this.avatar = undefined;
            this.background = undefined;
            console.log('logout - Token, UserId, and Role removed');
          })
        );
    }
  
    isLoggedIn(): boolean {
      const loggedIn = !!this.token && !!this.userId && !!this.role;
      console.log('isLoggedIn:', loggedIn);
      return loggedIn;
    }
  
    getToken(): string {
      console.log('getToken:', this.token);
      return this.token;
    }
  
    setToken(token: string): void {
      this.token = token;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', token);
        console.log('setToken - Token set:', this.token);
      }
    }
  
    getEmail(): string {
      return localStorage.getItem('email') || '';
    }

    setBackground(background: string): void {
      localStorage.setItem('background', background);
    }

    getBackground(): string {
      return localStorage.getItem('background') || '';
    }
  }
