import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { OrderService } from '../../../services/orderService/order-service';
import { UserService } from '../../../services/userService/user-service';
import { OrderSummaryModel, OrderDetailsModel, UpdateOrderStatusModel } from '../../../models/order-model';
import { AdminReviewModel } from '../../../models/review-model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    SelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.scss',
})
export class AdminOrders implements OnInit {
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedOrder: OrderDetailsModel | null = null;
  selectedOrderCustomerEmail = '';
  orderDetailsDialog = false;
  loading = true;
  selectedStatus = 'all';
  updatingOrderIds = new Set<number>();

  reviews: AdminReviewModel[] = [];
  reviewsLoading = false;
  activeTab: 'orders' | 'reviews' = 'orders';

  orderStatusOptions: Array<{ label: string; value: string }> = [];

  statusOptions: Array<{ label: string; value: string }> = [
    { label: 'All', value: 'all' },
  ];

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
    await this.loadStatuses();
    await this.loadData();
  }

  private async loadStatuses() {
    try {
      const apiStatuses = await firstValueFrom(this.orderService.getOrderStatuses());
      const normalizedValues = Array.from(
        new Set(
          (apiStatuses || [])
            .map((status) => this.normalizeStatusValue(status))
            .filter((value): value is string => !!value)
        )
      );

      this.orderStatusOptions = normalizedValues.map((value) => ({
        label: this.formatStatusLabel(value),
        value,
      }));

      this.statusOptions = [
        { label: 'All', value: 'all' },
        ...this.orderStatusOptions,
      ];
    } catch (error) {
      this.orderStatusOptions = [];
      this.statusOptions = [{ label: 'All', value: 'all' }];
      this.messageService.add({
        severity: 'warn',
        summary: 'Statuses unavailable',
        detail: 'Could not load order statuses from server.',
        life: 3000,
      });
    }
  }

  private normalizeStatusValue(rawStatus: any): string | null {
    const candidate =
      (typeof rawStatus === 'string' && rawStatus) ||
      rawStatus?.statusName ||
      rawStatus?.name ||
      rawStatus?.value ||
      rawStatus?.status;

    if (!candidate) return null;
    return String(candidate).trim().toLowerCase();
  }

  private formatStatusLabel(statusValue: string): string {
    const normalized = statusValue.replace(/[_-]+/g, ' ');
    return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  async loadData() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.orderService.getOrders());
      console.log('Orders Full Response:', response);
      this.orders = (response.orders || []).map((order: any) => ({
        ...order,
        statusDraft: order.statusName?.toLowerCase() || '',
      }));
      console.log('Total Orders:', this.orders.length);
      this.filterOrders();
    } catch (error) {
      console.error('Orders Error:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load orders' });
    } finally {
      this.loading = false;
    }
  }

  filterOrders() {
    if (this.selectedStatus === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o.statusName?.toLowerCase() === this.selectedStatus);
    }
  }

  async viewOrderDetails(order: any) {
    try {
      this.selectedOrderCustomerEmail = order.userEmail || '';
      this.selectedOrder = await firstValueFrom(this.orderService.getOrderDetails(order.orderId));
      this.orderDetailsDialog = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load order details' });
    }
  }

  async saveOrderStatus(order: any) {
    const nextStatus = order.statusDraft;
    const currentStatus = order.statusName?.toLowerCase();

    if (!nextStatus || nextStatus === currentStatus) {
      return;
    }

    this.updatingOrderIds.add(order.orderId);

    try {
      const orderDetails = await firstValueFrom(this.orderService.getOrderDetails(order.orderId));
      const payload: UpdateOrderStatusModel = {
        orderId: order.orderId,
        statusName: this.formatStatusLabel(nextStatus),
        userId: orderDetails?.userId,
        siteName: order.siteName || orderDetails?.siteName || '',
        siteTypeName: order.siteTypeName || orderDetails?.siteTypeName || '',
        siteDescription: orderDetails?.siteDescription || '',
        orderSum: order.orderSum ?? orderDetails?.orderSum ?? 0,
        orderDate: order.orderDate || orderDetails?.orderDate,
        reviewId: orderDetails?.reviewId,
        score: orderDetails?.score,
        reviewImageUrl: order.reviewImageUrl || orderDetails?.reviewImageUrl || '',
      };

      await firstValueFrom(
        this.orderService.updateOrderStatus(payload)
      );

      order.statusName = payload.statusName;

      if (this.selectedOrder && this.selectedOrder.orderId === order.orderId) {
        this.selectedOrder.statusName = order.statusName;
      }

      this.filterOrders();
      this.messageService.add({
        severity: 'success',
        summary: 'Order updated',
        detail: `Order #${order.orderId} status updated to ${order.statusName}`,
        life: 3000,
      });
    } catch {
      order.statusDraft = currentStatus || order.statusDraft;
      this.messageService.add({
        severity: 'error',
        summary: 'Update failed',
        detail: 'Failed to update order status',
        life: 3000,
      });
    } finally {
      this.updatingOrderIds.delete(order.orderId);
    }
  }

  hideDialog() {
    this.orderDetailsDialog = false;
    this.selectedOrder = null;
    this.selectedOrderCustomerEmail = '';
  }

  getCustomerDisplayName(email?: string): string {
    if (!email) return 'Unknown Customer';
    const localPart = email.split('@')[0] || email;
    return localPart.replace(/[._-]+/g, ' ');
  }

  getOrderDialogHeader(): string {
    if (!this.selectedOrder?.orderId) {
      return 'Order Details';
    }

    const orderRef = this.selectedOrder.orderId.toString().slice(-8);
    return `Order Details #${orderRef}`;
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'pending': return 'warn';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  async setTab(tab: 'orders' | 'reviews') {
    this.activeTab = tab;
    if (tab === 'reviews' && this.reviews.length === 0) {
      await this.loadReviews();
    }
  }

  async loadReviews() {
    this.reviewsLoading = true;
    try {
      this.reviews = await firstValueFrom(this.orderService.getAllReviews());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load reviews' });
    } finally {
      this.reviewsLoading = false;
    }
  }

  getStarArray(score: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(score));
  }
}
