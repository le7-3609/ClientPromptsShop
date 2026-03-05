import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../services/userService/user-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users: any[] = [];
  loading = true;

  async ngOnInit() {
    await this.checkAdminAccess();
  }

  private async checkAdminAccess() {
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth']);
      return;
    }
    if (user.email?.toLowerCase() !== 'clicksite@gmail.com') {
      this.router.navigate(['/home']);
      return;
    }
    await this.loadUsers();
  }

  async loadUsers() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.userService.getAdminUsers());
      this.users = this.normalizeUsersResponse(response);
    } catch {
      this.users = [];
    } finally {
      this.loading = false;
    }
  }

  private normalizeUsersResponse(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.users)) return response.users;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.body)) return response.body;
    return [];
  }

  getDisplayName(user: any): string {
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
    return fullName || user?.name || 'N/A';
  }

  getRole(user: any): string {
    if (user?.role) return user.role;
    if (typeof user?.isAdmin === 'boolean') {
      return user.isAdmin || user.email?.toLowerCase() === 'clicksite@gmail.com' ? 'Admin' : 'User';
    }
    return 'User';
  }

  formatDate(dateValue?: string): string {
    if (!dateValue) return 'N/A';
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return 'N/A';
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

}
