export interface OrderItemModel {
    orderItemId: number;
    productName: string | null;
    price: number;
    platformName: string | null;
    userDescription: string;
    promptId: number | null;
    prompt: string | null;
}

export interface OrderSummaryModel {
    orderId: number;
    orderDate?: string;
    orderSum: number;
    statusName: string;
    reviewImageUrl: string;
    siteName: string;
    siteTypeName: string;
    orderItemsCount: number;
}

export interface OrderDetailsModel extends OrderSummaryModel {
    userId: number;
    reviewId: number;
    score: number;
    siteDescription: string;
    items: OrderItemModel[];
}

export interface AddReviewModel {
    orderId: number;
    score: number;
    note: string;
    reviewImageUrl: string;
}

export interface UpdateOrderStatusModel {
    orderId: number;
    statusName: string;
    userId?: number;
    siteName?: string;
    siteTypeName?: string;
    siteDescription?: string;
    orderSum?: number;
    orderDate?: string;
    reviewId?: number;
    score?: number;
    reviewImageUrl?: string;
}

export interface OrderUIModel extends OrderSummaryModel {
    isExpanded: boolean;
    itemsLoaded: boolean;
    items: OrderItemModel[];
    reviewId?: number;
    score?: number;
}