import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlTransformerService {
  transformYoutubeUrl(url: string): string {
    if (!url) return '';
    
    try {
      // Convert to HTTPS if needed
      let transformedUrl = url.replace(/^http:/, 'https:');
      
      // Handle already embedded URLs
      if (transformedUrl.includes('/embed/')) {
        return transformedUrl;
      }
      
      // Extract video ID
      const videoId = this.extractVideoId(transformedUrl);
      if (!videoId) {
        console.warn('Could not extract video ID from URL:', url);
        return url;
      }
      
      // Return embedded format
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.warn('Error transforming YouTube URL:', error);
      return url;
    }
  }

  private extractVideoId(url: string): string | null {
    try {
      // Handle standard watch URLs
      if (url.includes('watch?v=')) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        if (videoId) return videoId;
      }
      
      // Handle youtu.be URLs
      if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/');
        if (parts[1]) {
          const videoId = parts[1].split(/[?#]/)[0];
          if (videoId) return videoId;
        }
      }
      
      // Handle direct video ID format
      if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
      }
      
      return null;
    } catch {
      return null;
    }
  }
}