import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { PageNotFound } from '../components/page-not-found/page-not-found';
import { AdminSiteTypes } from './components/admin-site-types/admin-site-types';
import { AdminSubCategories } from './components/admin-sub-categories/admin-sub-categories';
import { AdminMainCategories } from './components/admin-main-categories/admin-main-categories';
import { AdminProducts } from './components/admin-products/admin-products';
import { AdminOrders } from './components/admin-orders/admin-orders';
import { AdminUsers } from './components/admin-users/admin-users';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',component: AdminLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'site-types', component: AdminSiteTypes },
      { path: 'sub-categories', component: AdminSubCategories },
      { path: 'main-categories', component: AdminMainCategories },
      { path: 'products', component: AdminProducts },
      { path: 'orders', component: AdminOrders },
      { path: 'users', component: AdminUsers },
    
      { path: '**', component: PageNotFound },
    ]
  }
];