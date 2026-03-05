
export interface UserProfileModel {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface CartItemModel {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    image?: string;
}