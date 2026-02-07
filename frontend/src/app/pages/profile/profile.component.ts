import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <div class="header">
          <h2>Meu Perfil</h2>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>

        <div *ngIf="user; else loading">
          <p><strong>Usuário:</strong> {{ user?.username }}</p>
          <p><strong>Email:</strong> {{ user?.email || 'Não informado' }}</p>
          <p><strong>Admin:</strong> {{ user?.is_staff ? 'Sim' : 'Não' }}</p>
        </div>

        <ng-template #loading>
          <p>Carregando...</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
   .profile-container {
      height: 95vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center; 
      background: linear-gradient(to right, #63a4ff, #1976d2);
      box-sizing: border-box;
      overflow: hidden;     
    }

    .profile-card {
      background: white;
      padding: 30px 25px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      width: 350px;
      text-align: left;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h2 {
      color: #1976d2;
      margin: 0;
    }

    .logout-btn {
      padding: 6px 12px;
      border: none;
      background-color: #c62828;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }

    .logout-btn:hover {
      background-color: #8e0000;
    }

    p {
      margin: 8px 0;
      font-size: 14px;
    }

    strong {
      color: #1976d2;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.http.get('http://127.0.0.1:8000/api/me/').subscribe({
      next: (res: any) => {
        this.user = res;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erro ao carregar perfil', err);
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
