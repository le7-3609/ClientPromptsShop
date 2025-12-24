import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountSettings } from './Components/account-settings/account-settings';
import { Auth } from './Components/auth/auth';
import { NotFoundComponent } from './Components/page-not-found/page-not-found';
import { MainCategory } from './Components/main-category/main-category';
import { SubCategory } from "./Components/sub-category/sub-category";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AccountSettings, Auth, NotFoundComponent, MainCategory, SubCategory],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');
}
