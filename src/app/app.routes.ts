import { Routes } from '@angular/router';
import { Auth } from './components/auth/auth';
import { AccountSettings } from './components/account-settings/account-settings';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { MainCategory } from './components/main-category/main-category';
import { SubCategory } from './components/sub-category/sub-category';
import { Home } from './components/home/home';
import { Orders } from './components/orders/orders';
import { BasicSite } from './components/basic-site/basic-site';
import { Contact } from './components/contact/contact';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { PaymentSuccess } from './components/payment-success/payment-success';
import { PrivacyPolicy } from './components/privacy-policy/privacy-policy';
import { TermsOfService } from './components/terms-of-service/terms-of-service';
import { Accessibility } from './components/accessibility/accessibility';
import { Reviews } from './components/reviews/reviews';
import { PlatformGuides } from './components/platform-guides/platform-guides';
import { adminGuard } from './auth/admin-guard';


export const routes: Routes = [  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home }, 
  { path: 'sub-category/:SubId', component: SubCategory },
  { path: 'main-category/:MainId', component: MainCategory },
  { path: 'login', redirectTo: 'auth'  }, 
  { path: 'register', redirectTo: 'auth' }, 
  { path: 'auth', component: Auth },
  { path: 'settings', component: AccountSettings },
  { path: 'orders', component: Orders },
  { path: 'contact', component: Contact },
  { path: 'categories',component:MainCategory},
  { path: 'catalog',component:SubCategory},
  { path: 'basicSite', component: BasicSite },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'all-reviews', component: Reviews },
  { path: 'payment-success', component: PaymentSuccess },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'terms-of-service', component: TermsOfService },
  { path: 'accessibility', component: Accessibility },
  { path: 'platform-guides', component: PlatformGuides },
  { path: 'admin', canActivate: [adminGuard], 
  loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: '**', component: PageNotFound },
];
