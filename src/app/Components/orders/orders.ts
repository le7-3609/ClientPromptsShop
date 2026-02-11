// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';
// import { DialogModule } from 'primeng/dialog';
// import { RatingModule } from 'primeng/rating';
// import { TextareaModule } from 'primeng/textarea';
// import { FileUploadModule } from 'primeng/fileupload';
// import { FormsModule } from '@angular/forms';
// import { OrderService } from '../../Services/OrderService/order-service';
// import { AddReviewModel, OrderSummaryModel } from '../../Models/order-model';
// import { FloatLabelModule } from 'primeng/floatlabel';

// @Component({
//   selector: 'app-orders',
//   standalone: true,
//   imports: [
//     CommonModule, ButtonModule, DialogModule, RatingModule, TextareaModule, FileUploadModule, FormsModule,FloatLabelModule
//   ],
//   templateUrl: './orders.html',
//   styleUrl: './orders.scss'
// })
// export class Orders implements OnInit {
//   orders: OrderSummaryModel[] = [];
//   userId: number = 123; 

//   displayReviewDialog: boolean = false;
//   selectedOrder: OrderSummaryModel | null = null;

//   newReview = {
//     stars: 5,
//     text: '',
//     image: ''
//   };

//   constructor(private orderService: OrderService) { }

//   ngOnInit() {
//     this.loadOrders();
//   }

//   loadOrders() {
//     this.orderService.getUserOrders(this.userId).subscribe({
//       next: (data) => this.orders = data,
//       error: (err) => console.error('שגיאה בטעינת הזמנות', err)
//     });
//   }

//   openReview(order: OrderSummaryModel) {
//     this.selectedOrder = order;
//     this.displayReviewDialog = true;
//   }

//   onFileSelect(event: any) {
//     // כאן בעתיד תעלי את הקובץ לשרת ותקבלי URL
//     console.log('קובץ נבחר:', event.files[0]);
//     this.newReview.image = 'assets/demo-path.png'; // דוגמה זמנית
//   }

//   saveReview() {
//     if (!this.selectedOrder) return;

//     const reviewData: AddReviewModel = {
//       orderId: this.selectedOrder.orderId,
//       score: this.newReview.stars,
//       note: this.newReview.text,
//       reviewImageUrl: this.newReview.image
//     };

//     this.orderService.addReview(reviewData).subscribe({
//       next: () => {
//         this.displayReviewDialog = false;
//         this.loadOrders(); 
//       },
//       error: (err) => alert('חלה שגיאה בשמירת הביקורת')
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { OrderService } from '../../Services/OrderService/order-service';
import { AddReviewModel, OrderDetailsModel, OrderSummaryModel } from '../../Models/order-model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, DialogModule, RatingModule, TextareaModule, FileUploadModule, FormsModule, FloatLabelModule,
    RouterLink
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders implements OnInit {
  // הגדרת המערך כ-OrderDetailsModel כדי שכל השדות יהיו נגישים ב-HTML
  orders: any[] = [];
  userId: number = sessionStorage.getItem('userId') ? +sessionStorage.getItem('userId')! : 0;
  displayReviewDialog: boolean = false;
  selectedOrder: OrderDetailsModel | null = null;

  newReview = {
    stars: 5,
    text: '',
    image: ''
  };

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getUserOrders(this.userId).subscribe({
      next: (data) => {
        this.orders = data.map(order => ({
          ...order,
          isExpanded: false 
        }));
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  onFileSelect(event: any) {
    console.log('File selected:', event.files[0]);
    this.newReview.image = 'assets/demo-path.png';
  }

  openReview(order: any) {
    this.selectedOrder = order;
    if (order.reviewId > 0) {
      this.newReview = {
        stars: order.score || 5,
        text: order.note || '', 
        image: order.reviewImageUrl || ''
      };
    } else {
      this.newReview = { stars: 5, text: '', image: '' };
    }
    this.displayReviewDialog = true;
  }

  saveReview() {
    if (!this.selectedOrder) return;

    const reviewData: AddReviewModel = {
      orderId: this.selectedOrder.orderId,
      score: this.newReview.stars,
      note: this.newReview.text,
      reviewImageUrl: this.newReview.image
    };

    this.orderService.saveReview(this.selectedOrder.orderId, reviewData).subscribe({
      next: () => {
        this.displayReviewDialog = false;
        this.loadOrders(); 
      },
      error: (err) => alert('Error saving review')
    });
  }
}