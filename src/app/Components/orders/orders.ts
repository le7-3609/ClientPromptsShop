import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { OrderService } from '../../services/orderService/order-service';
import { UserService } from '../../services/userService/user-service';
import { DownloadService } from '../../services/downloadService/download-service';
import { Router, RouterLink } from '@angular/router';
import { AddReviewModel, OrderDetailsModel, OrderUIModel } from '../../models/order-model';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    RatingModule,
    TextareaModule,
    FileUploadModule,
    FormsModule,
    FloatLabelModule,
    RouterLink,
    SelectButtonModule
  ],
  providers: [MessageService],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  orders: OrderUIModel[] = [];
  displayReviewDialog: boolean = false;
  selectedOrder: OrderDetailsModel | null = null;
  selectedFile: File | null = null;
  /** Tracks which order items have their AI prompt expanded */
  expandedPromptItemIds: Set<number> = new Set();

  newReview = {
    stars: 5,
    text: '',
    image: '',
  };

  isEditingReview: boolean = false;

  // Download dialog state
  displayDownloadDialog = false;
  downloadOrderId: number | null = null;
  downloadOrderName = '';
  selectedFormat: 'pdf' | 'html' = 'pdf';
  isDownloading = false;
  formatOptions = [
    { label: 'PDF', value: 'pdf', icon: 'pi pi-file-pdf' },
    { label: 'HTML', value: 'html', icon: 'pi pi-code' },
  ];

  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private downloadService = inject(DownloadService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  ngOnInit() {
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth'], { queryParams: { returnUrl: '/orders' } });
      return;
    }
    this.loadOrders(user.userId);
  }

  loadOrders(userId: number) {
    this.orderService.getUserOrders(userId).subscribe({
      next: (data) => {
        this.orders = data.map((order) => ({
          ...order,
          isExpanded: false,
          itemsLoaded: false,
          items: [],
        }));
      },
      error: (err) => console.error('Error loading orders:', err),
    });
  }

  toggleOrderDetails(order: any) {
    if (order.isExpanded) {
      order.isExpanded = false;
      return;
    }
    if (order.itemsLoaded) {
      order.isExpanded = true;
      return;
    }
    // Fetch items lazily via GET /api/Orders/{orderId}/orderItems
    this.orderService.getOrderItems(order.orderId).subscribe({
      next: (items) => {
        order.items = items;
        order.orderItemsCount = items.length;
        order.itemsLoaded = true;
        order.isExpanded = true;
      },
      error: (err) => console.error('Error loading order items:', err),
    });
  }

  onFileSelect(event: any) {
    const file: File = event.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.newReview.image = e.target.result as string;
    };
    reader.readAsDataURL(file);
  }

  /** Toggles the expanded state of an AI Design prompt on an order item */
  togglePromptExpand(orderItemId: number) {
    if (this.expandedPromptItemIds.has(orderItemId)) {
      this.expandedPromptItemIds.delete(orderItemId);
    } else {
      this.expandedPromptItemIds.add(orderItemId);
    }
  }

  isPromptExpanded(orderItemId: number): boolean {
    return this.expandedPromptItemIds.has(orderItemId);
  }

  openReview(order: any) {
    this.selectedOrder = order;
    this.isEditingReview = !!order.reviewId;
    if (order.reviewId > 0) {
      this.newReview = {
        stars: order.score || 5,
        text: order.note || '',
        image: order.reviewImageUrl || '',
      };
    } else {
      this.newReview = { stars: 5, text: '', image: '' };
    }
    this.displayReviewDialog = true;
  }

  saveReview() {
   if (!this.selectedOrder) return;

    const review: AddReviewModel = {
      orderId: this.selectedOrder.orderId,
      score: this.newReview.stars,
      note: this.newReview.text,
      reviewImageUrl: this.newReview.image,
    };

    const request$ = this.isEditingReview
      ? this.orderService.updateReview(this.selectedOrder.orderId, review)
      : this.orderService.saveReview(this.selectedOrder.orderId, review);

    request$.subscribe({
        next: () => {
            this.displayReviewDialog = false;
            this.selectedFile = null; 
            const user = this.userService.getCurrentUser();
            if (user) this.loadOrders(user.userId);
            this.messageService.add({
              severity: 'success',
              summary: this.isEditingReview ? 'Review updated' : 'Review submitted',
              detail: this.isEditingReview
                ? 'Your review was updated successfully.'
                : 'Your review was submitted successfully.',
              life: 3000,
            });
        },
        error: (err) => {
          this.messageService.add({ 
          severity: 'error', 
          summary: this.isEditingReview ? 'Failed to update review' : 'Failed to save review', 
          detail: 'Your review could not be saved. Please try again later.',
          life: 3000
        });
        },
    });
  }

  // ── Download prompt ──────────────────────────────────────────

  openDownloadDialog(order: OrderUIModel) {
    this.downloadOrderId = order.orderId;
    this.downloadOrderName = order.siteName || `Order-${order.orderId}`;
    this.selectedFormat = 'pdf';
    this.displayDownloadDialog = true;
  }

  confirmDownload() {
    if (!this.downloadOrderId) return;
    this.isDownloading = true;

    this.orderService.getOrderPrompt(this.downloadOrderId).subscribe({
      next: (text) => {
        const fileName = this.downloadOrderName;
        if (this.selectedFormat === 'pdf') {
          this.downloadService.downloadAsPdf(text, fileName);
        } else {
          this.downloadService.downloadAsHtml(text, fileName);
        }
        this.isDownloading = false;
        this.displayDownloadDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Download started',
          detail: `Your prompt has been downloaded as ${this.selectedFormat.toUpperCase()}.`,
          life: 3000,
        });
      },
      error: () => {
        this.isDownloading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Download failed',
          detail: 'Could not retrieve the prompt. Please try again later.',
          life: 3000,
        });
      },
    });
  }
}