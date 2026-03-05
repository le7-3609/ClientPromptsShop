import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CartService } from '../../services/cartService/cart-service';
import { UserService } from '../../services/userService/user-service';
import { SiteTypeService } from '../../services/siteTypeService/site-type-service';
import { CreateBasicSiteDto, UpdateBasicSiteDto, BasicSiteInfo } from '../../models/cart-model';
import { SiteTypeModel } from '../../models/site-type-model';
import { Platform, PlatformService } from '../../services/platformService/platform-service';
import { GeminiService } from '../../services/geminiService/gemini-service';
import { GeminiPromptModel } from '../../models/gemini-prompt-model';

@Component({
  selector: 'app-basic-site',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, InputTextModule, ButtonModule, FloatLabelModule, SelectModule, ConfirmDialogModule],
  templateUrl: './basic-site.html',
  styleUrl: './basic-site.scss',
  providers: [MessageService, ConfirmationService],
})
export class BasicSite implements OnInit {
  private cartService = inject(CartService);
  private userService = inject(UserService);
  private siteTypeService = inject(SiteTypeService);
  private platformService = inject(PlatformService);
  private geminiService = inject(GeminiService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  formData = {
    siteName: '',
    userDescription: '',
    siteTypeId: 0,
    platformId: 0,
  };

  platforms: Platform[] = [];
  siteTypes: SiteTypeModel[] = [];
  isSubmitting = false;
  isLoading = false;
  isAiProcessing = false;
  selectedSiteTypeDescription = '';

  /** Whether we are editing an existing basic site (update) vs creating a new one */
  isEditMode = false;
  /** The existing basicSiteId when editing */
  existingBasicSiteId: number | null = null;
  /** Tracks if form was already populated from a loaded basic site (prevents overwriting user edits) */
  private basicSiteFormPopulated = false;

  aiData = '';
  isSubmitted = false;
  prompt: GeminiPromptModel | null = null;
  useAiMode = false;

  async ngOnInit() {
    await this.loadPlatformsAndSiteTypes();

    // Ensure server cart is loaded before checking for existing basic site
    const user = this.userService.getCurrentUser();
    if (user) {
      await this.cartService.ensureCartLoaded(user.userId);
    }

    this.loadExistingBasicSite();

    // Also subscribe to catch late basic site loads (e.g. after cart sync on login redirect)
    this.cartService.basicSite$.subscribe((site) => {
      if (site && !this.basicSiteFormPopulated) {
        this.basicSiteFormPopulated = true;
        this.isEditMode = true;
        this.existingBasicSiteId = site.basicSiteId;
        if (!this.formData.siteName) {
          this.formData.siteName = site.siteName || '';
          this.formData.userDescription = site.siteDescription || '';
          this.formData.platformId = site.platformId || 0;
          this.updateSiteTypeFromName(site.siteTypeName);
        }
      }
    });
  }

  async loadPlatformsAndSiteTypes(): Promise<void> {
    this.isLoading = true;
    try {
      const platformsResult = await this.platformService.getPlatforms();
      this.platforms = Array.isArray(platformsResult) ? platformsResult : [];
    } catch (error) {
      console.error('Failed to load platforms:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load platforms',
      });
    }

    try {
      const siteTypesResult = await this.siteTypeService.getSiteTypes();
      this.siteTypes = Array.isArray(siteTypesResult) ? siteTypesResult : [];
    } catch (error) {
      console.error('Failed to load site types:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load site types',
      });
    }

    this.isLoading = false;
  }

  loadExistingBasicSite(): void {
    const basicSiteInfo = this.cartService.getBasicSiteInfo();
    if (!basicSiteInfo) {
      this.isEditMode = false;
      this.existingBasicSiteId = null;
      return;
    }

    this.basicSiteFormPopulated = true;
    this.isEditMode = true;
    this.existingBasicSiteId = basicSiteInfo.basicSiteId;
    this.formData.siteName = basicSiteInfo.siteName || '';
    this.formData.userDescription = basicSiteInfo.siteDescription || '';
    this.formData.platformId = basicSiteInfo.platformId || 0;
    this.updateSiteTypeFromName(basicSiteInfo.siteTypeName);
  }

  /** Helper to set siteTypeId from siteTypeName */
  private updateSiteTypeFromName(siteTypeName: string | undefined): void {
    if (siteTypeName && this.siteTypes.length > 0) {
      const found = this.siteTypes.find((st) => st.siteTypeName === siteTypeName);
      if (found) {
        this.formData.siteTypeId = Number(found.siteTypeId);
        this.selectedSiteTypeDescription = found.siteTypeDescription || '';
      }
    }
  }

  onPlatformChange(): void {}

  onSiteTypeChange(): void {
    if (this.useAiMode) {
      return;
    }

    if (this.formData.siteTypeId) {
      this.prompt = null;
      this.aiData = '';
      this.isSubmitted = false;
    }

    const selectedSiteType = this.siteTypes.find(
      (s) => Number(s.siteTypeId) === this.formData.siteTypeId
    );
    if (!selectedSiteType) {
      this.selectedSiteTypeDescription = '';
      return;
    }

    this.selectedSiteTypeDescription = selectedSiteType.siteTypeDescription;
    this.formData.userDescription = selectedSiteType.siteTypeDescription;
  }

  handleAiSubmit(): void {
    if (this.formData.siteTypeId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Choose One Method',
        detail: 'Use either Site Type selection or AI prompt, not both.',
      });
      return;
    }

    const request = this.aiData.trim();
    if (!request) {
      return;
    }

    this.isAiProcessing = true;
    this.geminiService.createBasicSitePrompt(request).subscribe({
      next: (response) => {
        this.prompt = response;
        this.aiData = response.prompt;
        this.formData.userDescription = response.prompt;
        this.formData.siteTypeId = 0;
        this.selectedSiteTypeDescription = '';
        this.isSubmitted = true;
        this.useAiMode = true;
        this.isAiProcessing = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to generate AI description',
        });
        this.isAiProcessing = false;
      },
    });
  }

  handleEdit(): void {
    if (!this.prompt) {
      return;
    }

    this.isAiProcessing = true;
    this.geminiService.updateBasicSitePrompt(this.prompt.promptId, this.aiData).subscribe({
      next: (response) => {
        this.prompt = response;
        this.aiData = response.prompt;
        this.formData.userDescription = response.prompt;
        this.isAiProcessing = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update AI description',
        });
        this.isAiProcessing = false;
      },
    });
  }

  handleDelete(): void {
    if (!this.prompt) {
      this.isSubmitted = false;
      this.useAiMode = false;
      this.aiData = '';
      this.formData.userDescription = '';
      return;
    }

    this.geminiService.deletePrompt(this.prompt.promptId).subscribe({
      next: () => {
        this.prompt = null;
        this.isSubmitted = false;
        this.useAiMode = false;
        this.aiData = '';
        this.formData.userDescription = '';
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete AI prompt',
        });
      },
    });
  }

  async saveBasicSite(): Promise<void> {
    // Guest cannot purchase a basic site
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Guest cannot purchase a basic site',
      });
      setTimeout(() => {
        this.router.navigate(['/auth'], { queryParams: { returnUrl: '/basicSite' } });
      }, 1500);
      return;
    }

    const hasSiteType = !!this.formData.siteTypeId;
    const hasAiPrompt = !!this.prompt && !!this.aiData.trim();

    if (hasSiteType && hasAiPrompt) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Choose One Method',
        detail: 'Please use either Site Type selection or AI prompt, not both.',
      });
      return;
    }

    if (!this.formData.siteName || !this.formData.platformId || (!hasSiteType && !hasAiPrompt)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields and choose Site Type or generate AI prompt',
      });
      return;
    }

    const finalDescription = this.aiData.trim() || this.formData.userDescription;

    // Ensure the user's cart is loaded
    await this.cartService.ensureCartLoaded(user.userId);

    // Check if the cart already has a basic site
    if (this.cartService.hasBasicSite() && !this.isEditMode) {
      // Show confirmation dialog to replace existing basic site
      this.confirmationService.confirm({
        key: 'replaceBasicSite',
        header: 'Replace Basic Site',
        message: 'You already have one basic site, would you like to replace it?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        accept: () => {
          // User wants to replace — update the existing basic site
          const existingInfo = this.cartService.getBasicSiteInfo();
          if (existingInfo) {
            this.performUpdate(existingInfo.basicSiteId, finalDescription);
          }
        },
        reject: () => {
          // User cancelled — do nothing
        },
      });
      return;
    }

    if (this.isEditMode && this.existingBasicSiteId) {
      await this.performUpdate(this.existingBasicSiteId, finalDescription);
    } else {
      await this.performCreate(finalDescription);
    }
  }

  onAiInputChange(value: string): void {
    this.aiData = value;
    const hasValue = !!value.trim();
    if (hasValue && !this.prompt) {
      this.formData.siteTypeId = 0;
      this.selectedSiteTypeDescription = '';
      this.useAiMode = true;
    }
    if (!hasValue && !this.prompt) {
      this.useAiMode = false;
      this.isSubmitted = false;
    }
  }

  private async performCreate(description: string): Promise<void> {
    this.isSubmitting = true;
    try {
      const createDto: CreateBasicSiteDto = {
        siteTypeId: this.formData.siteTypeId || 0,
        siteName: this.formData.siteName,
        userDescreption: description,
        platformId: this.formData.platformId,
      };
      await this.cartService.createBasicSite(createDto);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Basic site created and added to cart successfully',
      });
      this.cartService.openSidebar();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create basic site',
      });
    } finally {
      this.isSubmitting = false;
    }
  }

  private async performUpdate(basicSiteId: number, description: string): Promise<void> {
    this.isSubmitting = true;
    try {
      const updateDto: UpdateBasicSiteDto = {
        siteTypeId: this.formData.siteTypeId || 0,
        siteName: this.formData.siteName,
        userDescreption: description,
        platformId: this.formData.platformId,
      };
      await this.cartService.updateBasicSite(basicSiteId, updateDto);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Basic site updated successfully',
      });
      this.cartService.openSidebar();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update basic site',
      });
    } finally {
      this.isSubmitting = false;
    }
  }
}
