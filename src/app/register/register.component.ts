import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      firstName: [''],
      lastName: [''],
      middleName: ['']
    });
  }

  // TO NAVIGATE TO LOGIN PAGE

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // HANDLES THE PROCESS OF REGISTRATIOM

  register() {
    if (this.registerForm.valid) {
      const { email, password, firstName, lastName, middleName } = this.registerForm.value;
      this.authService.register(email, password, firstName, lastName, middleName ).subscribe(
        (response: any) => {
          this.router.navigate(['/login']);
        },
        (error: any) => {
          console.error('Registration failed', error);
        }
      );
    }
  }
}