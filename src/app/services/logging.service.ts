import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  log(message: string, data?: any) {
    console.log(`[LOG] ${message}`, data || '');
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error || '');
  }

  warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data || '');
  }

  info(message: string, data?: any) {
    console.info(`[INFO] ${message}`, data || '');
  }
}