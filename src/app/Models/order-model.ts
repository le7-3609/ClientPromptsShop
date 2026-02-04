export interface OrderItemModel {
    orderItemId: number;
    productName: string;
    price: number;
    platformName: string;
    userDescription: string;
}

export interface OrderSummaryModel {
    orderId: number;
    orderDate?: string;
    orderSum: number;
    statusName: string;
}

export interface OrderDetailsModel extends OrderSummaryModel{
    orderItemsCount: number;
    userId: number;
    reviewId: number;
    reviewImageUrl: string;
    score: number;
    siteName: string;
    siteTypeName: string;
    siteDescription: string;
    items: OrderItemModel[];
}

export interface AddReviewModel {
    orderId: number;
    score: number;
    note: string;
    reviewImageUrl: string;
}

export interface OrderUIModel extends OrderDetailsModel {
    isExpanded?: boolean;
}