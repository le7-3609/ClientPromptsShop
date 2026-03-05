import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Platform {
  platformId: number;
  platformName: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private http = inject(HttpClient);
  private BASIC_URL = `${environment.apiUrl}/Platforms`;

  async getPlatforms(): Promise<Platform[]> {
    return firstValueFrom(this.http.get<Platform[]>(this.BASIC_URL));
  }
}
