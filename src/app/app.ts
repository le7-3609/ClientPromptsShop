import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AccountSettings } from './Components/account-settings/account-settings';
import { AuthComponent } from './Components/auth/auth';
import { NotFoundComponent } from './Components/page-not-found/page-not-found';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AccountSettings, AuthComponent, NotFoundComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');
}
