import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { UsersService, User } from './users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-container" *ngIf="isAdmin; else noAccess">
      <div class="users-card">
        <div class="header">
          <h2>Usuários</h2>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>

        <table class="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Email</th>
              <th>Status</th>
              <th>Admin</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.is_active ? 'Ativo' : 'Inativo' }}</td>
              <td>{{ user.is_staff ? 'Sim' : 'Não' }}</td>
              <td class="actions-cell">
                <button (click)="openEdit(user)">Editar</button>
                <button class="danger" (click)="deleteUser(user)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>

        <button class="create-btn" (click)="openCreate()">+ Novo usuário</button>

        <!-- MODAL -->
        <div class="modal-backdrop" *ngIf="showModal">
          <div class="modal">
            <h3>{{ editingUser?.id ? 'Editar usuário' : 'Novo usuário' }}</h3>
            <form (ngSubmit)="saveUser()">
              <label>
                Usuário
                <input [(ngModel)]="form.username" name="username" required />
              </label>
              <label>
                Email
                <input [(ngModel)]="form.email" name="email" required />
              </label>
              <label>
                Senha
                <input [(ngModel)]="form.password" name="password" type="password" />
              </label>
              <label>
                <input type="checkbox" [(ngModel)]="form.is_active" name="active" />
                Ativo
              </label>
              <label>
                <input type="checkbox" [(ngModel)]="form.is_staff" name="staff" />
                Admin
              </label>
              <div class="modal-actions">
                <button type="submit">Salvar</button>
                <button type="button" (click)="closeModal()">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <ng-template #noAccess>
      <p class="no-access">Você não tem permissão para acessar esta página.</p>
    </ng-template>
  `,
  styles: [`
    .users-container {
   height: 95vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center; 
  background: linear-gradient(to right, #63a4ff, #1976d2);
  box-sizing: border-box;
  overflow: hidden;     
}

    .users-card {
      background: white;
      padding: 25px 20px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 900px;
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

    .users-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      table-layout: fixed;
    }

    .users-table th,
    .users-table td {
      padding: 8px;
      border-bottom: 1px solid #ccc;
      text-align: left;
      word-wrap: break-word;
      font-size: 14px;
    }

    .users-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .users-table td {
      background-color: #fff;
    }

    .actions-cell button {
      margin-right: 5px;
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .actions-cell button:hover {
      opacity: 0.8;
    }

    .actions-cell .danger {
      color: white;
      background-color: #c62828;
    }

    .create-btn {
      margin-top: 12px;
      padding: 6px 12px;
      border: none;
      background-color: #1976d2;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    .create-btn:hover {
      background-color: #115293;
    }

    /* MODAL */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: #fff;
      padding: 25px;
      width: 400px;
      border-radius: 10px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }

    form label {
      display: block;
      margin-bottom: 10px;
      font-size: 14px;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 6px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }

    .no-access {
      text-align: center;
      color: white;
      font-size: 18px;
      margin-top: 50px;
    }
  `]
})
export class UsersComponent implements OnInit {
  isAdmin = false;
  users: User[] = [];
  loading = false;
  showModal = false;
  editingUser: User | null = null;
  form: User = { username: '', email: '', password: '', is_active: true, is_staff: false };

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.usersService.list().subscribe({
      next: res => { this.users = res; this.cdr.detectChanges(); },
      complete: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  openCreate() {
    this.editingUser = null;
    this.form = { username: '', email: '', password: '', is_active: true, is_staff: false };
    this.showModal = true;
  }

  openEdit(user: User) {
    this.editingUser = user;
    this.form = { ...user };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  saveUser() {
    if (this.editingUser?.id) {
      this.usersService.updateUser(this.editingUser.id, this.form).subscribe(() => { this.loadUsers(); this.closeModal(); });
    } else {
      this.usersService.createUser(this.form).subscribe(() => { this.loadUsers(); this.closeModal(); });
    }
  }

  deleteUser(user: User) {
    if (confirm(`Excluir ${user.username}?`)) {
      this.usersService.deleteUser(user.id!).subscribe(() => this.loadUsers());
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
