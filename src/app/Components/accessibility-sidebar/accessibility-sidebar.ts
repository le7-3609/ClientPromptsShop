import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AccessibilityService, FontScale } from '../../services/accessibilityService/accessibility-service';

@Component({
  selector: 'app-accessibility-sidebar',
  imports: [CommonModule, FormsModule, ButtonModule, ToggleSwitchModule],
  templateUrl: './accessibility-sidebar.html',
  styleUrl: './accessibility-sidebar.scss',
})
export class AccessibilitySidebar {
  a11y = inject(AccessibilityService);
  isOpen = false;

  get s() { return this.a11y.settings; }

  toggle() { this.isOpen = !this.isOpen; }
  setFont(scale: FontScale) { this.a11y.setFontScale(scale); }
}
