export interface CartItemModel {
    cartItemId: number;
    cartId: number;
    productId: number;
    productName: string;
    price: number;
    imageUrl: string;
    subCategoryName: string;
    platformName: string;
    userDescription: string;
    isActive: boolean;
}

export interface AddCartItemDto {
    cartId: number;
    productId: number;
    basicSitesPlatformId: number;
    userDescription: string;
}