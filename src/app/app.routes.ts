import { Routes } from '@angular/router';
import { Auth } from './Components/auth/auth';
import { AccountSettings } from './Components/account-settings/account-settings';
import { PageNotFound } from './Components/page-not-found/page-not-found';
import { MainCategory } from './Components/main-category/main-category';
import { SubCategory } from './Components/sub-category/sub-category';
import { Home } from './Components/home/home';
import { Orders } from './Components/orders/orders';
import { BasicSite } from './Components/basic-site/basic-site';
import { Contact } from './Components/contact/contact';
import { Category } from './Components/category/category';


export const routes: Routes = [  
  { path: 'home', component: Home }, 
  { path: 'sub-category/:SubId', component: Category },
  { path: 'main-category/:MainId', component: MainCategory },
  { path: 'login', redirectTo: 'auth'  }, 
  { path: 'register', redirectTo: 'auth' }, 
  { path: 'auth', component: Auth },
  { path: 'settings', component: AccountSettings },
  { path: 'orders', component: Orders },
  { path: 'contact', component: Contact },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path:'categories',component:MainCategory},
  { path:'catalog',component:SubCategory},
  { path: 'basicSite', component: BasicSite },
  { path: '**', component: PageNotFound }
];
