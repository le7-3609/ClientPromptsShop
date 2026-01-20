import { Routes } from '@angular/router';
import { Auth } from './Components/auth/auth';
import { AccountSettings } from './Components/account-settings/account-settings';
import { PageNotFound } from './Components/page-not-found/page-not-found';
import { MainCategory } from './Components/main-category/main-category';
import { SubCategory } from './Components/sub-category/sub-category';

export const routes: Routes = [  
  { path: 'home', component: MainCategory }, // ודאי שהנתיב 'home' קיים כאן
  { path: 'sub-category/:SubId', component: SubCategory },
  { path: 'main-category/:mainId', component: MainCategory },
  { path: 'login', redirectTo: 'auth'  }, 
  { path: 'register', redirectTo: 'auth' }, 
  { path: 'auth', component: Auth },
  { path: 'settings', component: AccountSettings },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path:'categories',component:MainCategory},
  {path:'catalog',component:SubCategory},

  { path: '**', component: PageNotFound }
];
