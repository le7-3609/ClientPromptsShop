import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bottom-navigation.html',
  styleUrl: './bottom-navigation.scss',
})
export class BottomNavigation {}
