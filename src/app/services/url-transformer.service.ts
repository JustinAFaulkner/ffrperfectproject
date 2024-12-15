import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlTransformerService {
  private readonly patterns = {
    watchUrl: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    embedUrl: /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    studioUrl: /studio\.youtube\.com\/video\/([a-zA-Z0-9_-]{11})(?:\/edit)?/,
    directId: /^[a-zA-Z0-9_-]{11}$/
  };

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
      // Try each pattern to extract video ID
      for (const [key, pattern] of Object.entries(this.patterns)) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }
}