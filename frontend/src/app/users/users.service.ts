import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  is_staff: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private readonly API_URL = 'http://127.0.0.1:8000/api/users/';

  constructor(private http: HttpClient) {}

    list(): Observable<User[]> {
            return this.http.get<User[]>(this.API_URL);
    }

  createUser(userData: User): Observable<any> {
    return this.http.post<User>(this.API_URL, userData);
  }

  updateUser(userId: number, userData: User): Observable<any> {
    return this.http.put<User>(`${this.API_URL}${userId}/`, userData);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}${userId}/`);
  }
}
