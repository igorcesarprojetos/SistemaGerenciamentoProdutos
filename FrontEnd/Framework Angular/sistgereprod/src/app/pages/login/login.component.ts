import { AuthService } from './../../services/auth.service';
import { LoginAuth } from '../../model/login-auth';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public loginAuth: LoginAuth = new LoginAuth();

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.authService.login(this.loginAuth).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // console.error('Login failed:', error);
        // alert('Login failed. Please check your credentials and try again.');
        const errEl = document.getElementById('login-error');
        errEl!.textContent = 'Login ou senha inválidos.';
        errEl!.style.display = 'block';
      }
    });
  }
}