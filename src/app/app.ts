import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Menu } from "./components/menu/menu";
import { CartSidebar } from "./components/cart-sidebar/cart-sidebar";
import { BottomNavigation } from "./components/bottom-navigation/bottom-navigation";
import { ChatBot } from './components/chat-bot/chat-bot';
import { AccessibilitySidebar } from './components/accessibility-sidebar/accessibility-sidebar';
import { AccessibilityService } from './services/accessibilityService/accessibility-service';
import { UserService } from './services/userService/user-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',

  imports: [RouterModule, Menu, CartSidebar, BottomNavigation, ChatBot, AccessibilitySidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');
  protected readonly userService = inject(UserService);
  private a11y = inject(AccessibilityService);
  private router = inject(Router);

isAdminPage = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects.startsWith('/admin'))
    ),
    { initialValue: this.router.url.startsWith('/admin') } 
  );
}
