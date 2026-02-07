import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
     <div class="login-container">
      <div class="login-card">
        <h2>Login</h2>

        <form (ngSubmit)="login()">
          <input
            [(ngModel)]="username"
            name="username"
            type="text"
            placeholder="Usuário"
            required
          />
          <input
            [(ngModel)]="password"
            name="password"
            type="password"
            placeholder="Senha"
            required
          />
          
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
   height: 95vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center; 
  background: linear-gradient(to right, #63a4ff, #1976d2);
  box-sizing: border-box;
  overflow: hidden;
}

    .login-card {
      background: white;
      padding: 40px 30px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      width: 350px;
      text-align: center;
    }

    .login-card h2 {
      color: #1976d2;
      margin-bottom: 20px;
    }

    .login-card input {
      width: 100%;
      padding: 12px;
      margin: 10px 0;
      border-radius: 6px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      font-size: 14px;
    }

    .login-card button {
      width: 100%;
      padding: 12px;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 15px;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }

    .login-card button:hover {
      background-color: #115293;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient // ✅ Injetado para fazer request
  ) {}

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: res => {
        console.log('Token recebido:', res.access_token);
        this.auth.saveToken(res.access_token);

        // Buscar info do usuário logado
        this.http.get('http://127.0.0.1:8000/api/me/').subscribe({
          next: (user: any) => {
            if (user.is_staff) {
              this.router.navigate(['/users']);
            } else {
              this.router.navigate(['/profile']);
            }
          },
          error: err => {
            console.error('Erro ao buscar usuário', err);
          }
        });
      },
      error: err => {
        console.error('Erro no login', err);
      }
    });
  }
}
