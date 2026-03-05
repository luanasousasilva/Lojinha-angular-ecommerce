import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../../types";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private users: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@email.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Regular User',
      email: 'user@email.com',
      password: 'user123',
      role: 'user'
    }
  ];

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    const userExists = this.users.find(u => u.email === email);
    if (userExists) return false;

    const newUser: User = {
      id: this.users.length + 1,
      name,
      email,
      password,
      role: 'user'
    };

    this.users.push(newUser);
    this.currentUserSubject.next(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  initializeUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }
}
