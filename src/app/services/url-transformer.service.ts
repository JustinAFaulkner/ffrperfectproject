import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlTransformerService {
  transformYoutubeUrl(url: string): string {
    try {
      // Convert to HTTPS if needed
      let transformedUrl = url.replace(/^http:/, 'https:');
      
      // Extract video ID
      const videoId = new URL(transformedUrl).searchParams.get('v');
      
      if (!videoId) {
        console.error('Could not extract video ID from URL:', url);
        return url;
      }
      
      // Return embedded format
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error('Error transforming YouTube URL:', error);
      return url;
    }
  }
}