import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { OrderService } from '../../services/orderService/order-service';
import { UserService } from '../../services/userService/user-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.scss',
})
export class PaymentSuccess implements OnInit {
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  
  orderNumber: number = 0;
  orderDate: string = new Date().toLocaleDateString();

  async ngOnInit() {
    try {
      const user = this.userService.getCurrentUser();
      if (user) {
        const orders = await firstValueFrom(this.orderService.getUserOrders(user.userId));
        if (orders && orders.length > 0) {
          // מציג את ההזמנה האחרונה
          const lastOrder = orders[orders.length - 1];
          this.orderNumber = lastOrder.orderId;
          this.orderDate = lastOrder.orderDate || this.orderDate;
        }
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      this.orderNumber = Math.floor(Math.random() * 1000000);
    }
  }
}
