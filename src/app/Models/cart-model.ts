export interface GuestCartItem {
  productId: number;
  platformId?: number;
  promptId?: number;
  userDescription: string;
  basicSiteId?: number;
}

export interface CartItemModel {
    cartItemId: number;
    cartId: number;
    productId: number;
    productName: string;
    price: number;
    imageUrl: string;
    subCategoryName: string;
    platformName: string;
    platformId?: number;
    userDescription: string;
    isActive: boolean;
}

export interface BasicSiteInfo {
    basicSiteId: number;
    siteName: string;
    siteTypeName: string;
    siteTypeId: number;
    siteDescription: string;
    platformId?: number;
    platformName?: string;
    price: number;
}

export interface CartModel {
    cartId: number;
    userId: number;
    basicSiteId?: number;
    siteName?: string;
    siteTypeName?: string;
    siteTypeId?: number;
    siteDescription?: string;
    basicSitePrice?: number;
    platformId?: number;
    platformName?: string;
    items: CartItemModel[];
}

export interface AddCartItemDto {
    cartId: number;
    productId: number;
    platformId?: number;
    promptId?: number;
    userDescription: string;
}

export interface CreateBasicSiteDto {
    siteTypeId: number;
    siteName: string;
    /** API expects "userDescreption" (server-side typo) */
    userDescreption: string;
    platformId?: number;
}

export interface UpdateBasicSiteDto {
    siteTypeId: number;
    siteName: string;
    /** API expects "userDescreption" (server-side typo) */
    userDescreption: string;
    platformId?: number;
}