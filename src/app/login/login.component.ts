import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(response => {
        console.log('Login response:', response);
        if (response && response.token && response.user_id) {
          this.authService.setToken(response.token);
          this.authService.setUserId(response.user_id);
          this.router.navigate(['/kanban-board']);
          console.log('Login successful - Token:', response.token, 'UserId:', response.user_id);
        } else {
          console.log('Login failed - Invalid response:', response);
        }
      }, error => {
        console.error('Login failed', error);
      });
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
