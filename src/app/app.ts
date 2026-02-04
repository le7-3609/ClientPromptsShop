import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Menu } from "./Components/menu/menu";

@Component({
  selector: 'app-root',

  imports: [RouterModule, Menu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');
}
