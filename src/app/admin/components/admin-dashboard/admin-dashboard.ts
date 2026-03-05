import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ChartModule } from 'primeng/chart';

import { UserService } from '../../../services/userService/user-service';
import { ProductService } from '../../../services/productService/product-service';
import { OrderService } from '../../../services/orderService/order-service';
import { MainCategoryService } from '../../../services/mainCategoryService/main-category-service';
import { OrderSummaryModel } from '../../../models/order-model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ChartModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit {
  private userService = inject(UserService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private mainCategoryService = inject(MainCategoryService);
  private router = inject(Router);
  private adminEmail = 'clicksite@gmail.com';

  public user: any = null;
  public loading = true;
  public stats = signal<any[]>([]);
  public recentOrders = signal<any[]>([]);
  public topProducts = signal<any[]>([]);
  public revenueChartData: any;
  public revenueChartOptions: any;
  public ordersChartData: any;
  public ordersChartOptions: any;

  async ngOnInit() {
    await this.checkAdminAccess();
  }

  private async checkAdminAccess() {
    try {
      const userData = this.userService.getCurrentUser();
      
      if (!userData) {
        this.router.navigate(['/auth']);
        return;
      }

      if (userData.email?.toLowerCase() !== this.adminEmail) {
        this.router.navigate(['/home']);
        return;
      }

      this.user = userData;
      await this.loadDashboardData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      this.router.navigate(['/auth']);
    } finally {
      this.loading = false;
    }
  }

  private withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
      )
    ]);
  }

  private async loadDashboardData() {
    try {
      const [productsResult, ordersResult, usersResult, categoriesResult] = await Promise.allSettled([
        this.withTimeout(this.productService.getProducts(100, 0)),
        this.withTimeout(firstValueFrom(this.orderService.getOrders())),
        this.withTimeout(firstValueFrom(this.userService.getUsers())),
        this.withTimeout(firstValueFrom(this.mainCategoryService.getMainCategory()))
      ]);

      const products =
        productsResult.status === 'fulfilled' && productsResult.value?.items
          ? productsResult.value.items
          : [];
      const orders = this.normalizeOrders(
        ordersResult.status === 'fulfilled' ? ordersResult.value : null
      );
      const users =
        usersResult.status === 'fulfilled' && Array.isArray(usersResult.value)
          ? usersResult.value
          : [];
      const categories =
        categoriesResult.status === 'fulfilled' && Array.isArray(categoriesResult.value?.body)
          ? categoriesResult.value.body
          : [];

      const sortedOrders = [...orders].sort((a, b) => {
        const aTime = a.orderDate ? new Date(a.orderDate).getTime() : 0;
        const bTime = b.orderDate ? new Date(b.orderDate).getTime() : 0;
        return bTime - aTime;
      });

      const totalRevenue = sortedOrders.reduce(
        (sum: number, order: any) => sum + (order.orderSum || 0),
        0
      );
      const activeProducts = products.filter((p: any) => p.isActive || p.is_active).length;
      const pendingOrders = sortedOrders.filter(
        (o: any) => o.statusName?.toLowerCase() === 'pending'
      ).length;
      const openOrders = sortedOrders.filter((o: any) =>
        ['pending', 'processing'].includes(o.statusName?.toLowerCase())
      ).length;

      const totalProducts =
        productsResult.status === 'fulfilled' && productsResult.value?.totalCount
          ? productsResult.value.totalCount
          : products.length;
      const totalCategories = categories.length;
      const newCustomers = this.countNewCustomers(users);

      const lastSevenDays = this.getLastDays(7);
      const dailyRevenue = this.buildDailyRevenue(sortedOrders, lastSevenDays);
      const dailyOrders = this.buildDailyOrders(sortedOrders, lastSevenDays);
      const dayLabels = lastSevenDays.map(day =>
        day.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      );

      this.revenueChartData = {
        labels: dayLabels,
        datasets: [
          {
            label: 'Revenue',
            data: dailyRevenue,
            borderColor: '#9333ea',
            backgroundColor: 'rgba(192, 132, 252, 0.25)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#d946ef',
            borderWidth: 2
          }
        ]
      };

      this.ordersChartData = {
        labels: dayLabels,
        datasets: [
          {
            label: 'Orders',
            data: dailyOrders,
            backgroundColor: ['#4c1d95', '#5b21b6', '#6d28d9', '#7e22ce', '#9333ea', '#a855f7', '#d946ef'],
            borderRadius: 8
          }
        ]
      };

      const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#ffffff',
            borderColor: '#e9d5ff',
            borderWidth: 1,
            titleColor: '#4c1d95',
            bodyColor: '#581c87',
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            ticks: { color: '#6d28d9', font: { size: 12 } },
            grid: { color: '#ede9fe', borderDash: [4, 4] }
          },
          y: {
            ticks: { color: '#6d28d9', font: { size: 12 } },
            grid: { color: '#ede9fe', borderDash: [4, 4] }
          }
        }
      };

      this.revenueChartOptions = baseOptions;
      this.ordersChartOptions = baseOptions;

      this.stats.set([
        {
          title: 'Total Revenue',
          value: this.formatCurrency(totalRevenue),
          icon: 'pi pi-dollar',
          color: 'from-purple-900 to-violet-700',
          link: '/admin/orders'
        },
        {
          title: 'Total Orders',
          value: sortedOrders.length,
          subtitle: `${pendingOrders} pending`,
          icon: 'pi pi-shopping-cart',
          color: 'from-violet-800 to-purple-600',
          link: '/admin/orders'
        },
        {
          title: 'Products',
          value: totalProducts,
          subtitle: `${activeProducts} active`,
          icon: 'pi pi-box',
          color: 'from-purple-700 to-violet-500',
          link: '/admin/products'
        },
        {
          title: 'Categories',
          value: totalCategories,
          icon: 'pi pi-folder-open',
          color: 'from-violet-700 to-fuchsia-500',
          link: '/admin/main-categories'
        },
        {
          title: 'Users',
          value: users.length,
          subtitle: `${newCustomers} new (30d)`,
          icon: 'pi pi-users',
          color: 'from-fuchsia-600 to-purple-500',
          link: '/admin/users'
        },
        {
          title: 'Open Orders',
          value: openOrders,
          subtitle: 'Need attention',
          icon: 'pi pi-exclamation-circle',
          color: 'from-purple-800 to-fuchsia-600',
          link: '/admin/orders'
        }
      ]);

      this.recentOrders.set(sortedOrders.slice(0, 5));
      this.topProducts.set(this.computeTopProducts(sortedOrders));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  private normalizeOrders(response: any): OrderSummaryModel[] {
    if (Array.isArray(response)) {
      return response as OrderSummaryModel[];
    }
    if (Array.isArray(response?.orders)) {
      return response.orders as OrderSummaryModel[];
    }
    if (Array.isArray(response?.Orders)) {
      return response.Orders as OrderSummaryModel[];
    }
    return [];
  }

  private countNewCustomers(users: any[]): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffTime = cutoff.getTime();
    return users.filter(user => {
      const createdAt = user?.createdAt ? new Date(user.createdAt).getTime() : 0;
      return createdAt >= cutoffTime;
    }).length;
  }

  private getLastDays(count: number): Date[] {
    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = count - 1; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      days.push(day);
    }
    return days;
  }

  private buildDailyRevenue(orders: OrderSummaryModel[], days: Date[]): number[] {
    return days.map(day => {
      const dayStart = new Date(day);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      return orders
        .filter(order => {
          if (!order.orderDate) return false;
          const orderTime = new Date(order.orderDate).getTime();
          return orderTime >= dayStart.getTime() && orderTime <= dayEnd.getTime();
        })
        .reduce((sum, order) => sum + (order.orderSum || 0), 0);
    });
  }

  private buildDailyOrders(orders: OrderSummaryModel[], days: Date[]): number[] {
    return days.map(day => {
      const dayStart = new Date(day);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      return orders.filter(order => {
        if (!order.orderDate) return false;
        const orderTime = new Date(order.orderDate).getTime();
        return orderTime >= dayStart.getTime() && orderTime <= dayEnd.getTime();
      }).length;
    });
  }

  private computeTopProducts(orders: any[]): any[] {
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

    orders.forEach(order => {
      const items = order.items || order.orderItems || order.orderItemsList || [];
      if (!Array.isArray(items)) return;
      items.forEach((item: any) => {
        const name = item.productName || item.name || `Product ${item.productId ?? 'Unknown'}`;
        const quantity = item.quantity ?? 1;
        const revenue = item.price ? item.price * quantity : 0;
        const existing = productMap.get(name) || { name, quantity: 0, revenue: 0 };
        existing.quantity += quantity;
        existing.revenue += revenue;
        productMap.set(name, existing);
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  }
}
