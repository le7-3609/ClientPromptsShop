import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ping',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ping.html',
  styleUrl: './ping.scss'
})
export class Ping {}
