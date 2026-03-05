import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { SiteTypeService } from '../../../services/siteTypeService/site-type-service';
import { UserService } from '../../../services/userService/user-service';
import { SiteTypeModel } from '../../../models/site-type-model';

@Component({
  selector: 'app-admin-site-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './admin-site-types.html',
  styleUrl: './admin-site-types.scss',
})
export class AdminSiteTypes implements OnInit {
  private siteTypeService = inject(SiteTypeService);
  private userService = inject(UserService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  siteTypes: SiteTypeModel[] = [];
  selectedSiteType: any = {};
  siteTypeDialog = false;
  submitted = false;
  loading = true;

  async ngOnInit() {
    await this.checkAdminAccess();
  }

  private async checkAdminAccess() {
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth']);
      return;
    }
    if (user.email?.toLowerCase() !== 'clicksite@gmail.com') {
      this.router.navigate(['/home']);
      return;
    }
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      this.siteTypes = await this.siteTypeService.getSiteTypes();
      console.log('Site Types Response:', this.siteTypes);
      console.log('Total Site Types:', this.siteTypes.length);
    } catch (error: any) {
      console.error('Site Types Error:', error);
      if (error.status === 404) {
        this.messageService.add({ severity: 'warn', summary: 'Notice', detail: 'Site Types API not available', life: 5000 });
        this.siteTypes = [];
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load site types' });
      }
    } finally {
      this.loading = false;
    }
  }

  openNew() {
    this.selectedSiteType = { siteTypeName: '', price: 0, siteTypeDescription: '', siteTypeNamePrompt: '', siteTypeDescriptionPrompt: '' };
    this.submitted = false;
    this.siteTypeDialog = true;
  }

  editSiteType(siteType: SiteTypeModel) {
    this.selectedSiteType = { ...siteType };
    this.siteTypeDialog = true;
  }

  hideDialog() {
    this.siteTypeDialog = false;
    this.submitted = false;
  }

  async saveSiteType() {
    this.submitted = true;
    if (this.selectedSiteType.siteTypeName?.trim()) {
      try {
        if (this.selectedSiteType.siteTypeId) {
          await this.siteTypeService.updateSiteType(this.selectedSiteType.siteTypeId, this.selectedSiteType);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Site Type Updated' });
        } else {
          await this.siteTypeService.addSiteType(this.selectedSiteType);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Site Type Created' });
        }
        this.siteTypeDialog = false;
        await this.loadData();
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Save failed' });
      }
    }
  }

  async deleteSiteType(siteType: SiteTypeModel) {
    if (confirm(`Delete ${siteType.siteTypeName}?`)) {
      try {
        await this.siteTypeService.deleteSiteType(Number(siteType.siteTypeId));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Site Type Deleted' });
        await this.loadData();
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
      }
    }
  }
}
