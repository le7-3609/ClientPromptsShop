import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SiteTypeModel } from '../../models/site-type-model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SiteTypeService {
  private http = inject(HttpClient);
  private BASIC_URL = `${environment.apiUrl}/SiteType`;

  async getSiteTypes(): Promise<SiteTypeModel[]> {
    return firstValueFrom(this.http.get<SiteTypeModel[]>(this.BASIC_URL));
  }

  async getSiteTypeById(id: number): Promise<SiteTypeModel> {
    return firstValueFrom(this.http.get<SiteTypeModel>(`${this.BASIC_URL}/${id}`));
  }

  async addSiteType(siteType: any): Promise<any> {
    return firstValueFrom(this.http.post(this.BASIC_URL, siteType, { withCredentials: true }));
  }

  async updateSiteType(id: number, siteType: any): Promise<any> {
    return firstValueFrom(this.http.put(`${this.BASIC_URL}/${id}`, siteType, { withCredentials: true }));
  }

  async deleteSiteType(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.BASIC_URL}/${id}`, { withCredentials: true }));
  }
}