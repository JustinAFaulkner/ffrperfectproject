import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  log(message: string, data?: any) {
    if (!environment.production) {
      console.log(`[LOG] ${message}`, data || '');
    }
  }

  error(message: string, error?: any) {
    if (!environment.production) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  }

  warn(message: string, data?: any) {
    if (!environment.production) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  info(message: string, data?: any) {
    if (!environment.production) {
      console.info(`[INFO] ${message}`, data || '');
    }
  }
}