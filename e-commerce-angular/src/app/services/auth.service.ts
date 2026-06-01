import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../app.models';
import { StorageService } from './storage.service';

const USER_KEY = 'user';
const SESSION_KEY = 'loggedInUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly storedUser = signal<User | null>(this.storage.getItem<User | null>(USER_KEY, null));

  readonly currentUser = signal<User | null>(this.storage.getItem<User | null>(SESSION_KEY, null));
  readonly hasRegisteredUser = computed(() => this.storedUser() !== null);

  signup(user: User): void {
    this.storage.setItem(USER_KEY, user);
    this.storedUser.set(user);
  }

  login(name: string, password: string): boolean {
    const user = this.storedUser();

    if (!user || user.name !== name || user.password !== password) {
      return false;
    }

    this.storage.setItem(SESSION_KEY, user);
    this.currentUser.set(user);
    return true;
  }

  logout(): void {
    this.storage.removeItem(SESSION_KEY);
    this.currentUser.set(null);
    void this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}