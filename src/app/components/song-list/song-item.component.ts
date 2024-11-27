import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';
import { Song } from '../../models/song.interface';

@Component({
  selector: 'app-song-item',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: '0', opacity: 0 })),
      ]),
    ]),
  ],
  template: `
    <div 
      class="song-item"
      [class.has-video]="song.youtubeUrl || song.youtubeUrl2"
      [class.no-video]="!song.youtubeUrl && !song.youtubeUrl2">
      <div class="song-header" (click)="toggleExpand()">
        <div class="song-diff">
          {{song.difficulty}}
        </div>
        <div class="song-info">
          <span class="song-title">{{song.title}}</span>
          <span class="song-subtitle">
            {{ isExpanded ? (currentSource === 1 ? song.contributor : song.contributor2) || '' : song.artist }}
            <span *ngIf="!isExpanded">
                Stepped by: {{song.stepartist}}
                <span *ngIf="(song.stepartist2 != null && song.stepartist2 !== '')"> & {{song.stepartist2}}</span>
                <span *ngIf="(song.stepartist3 != null && song.stepartist3 !== '')"> & {{song.stepartist3}}</span>
            </span>
          </span>
        </div>
        <div *ngIf="!isExpanded" class="song-details">
          <span class="song-duration">{{song.duration}}</span>
          <span class="song-genre">{{song.genre}}</span>
        </div>
      </div>
      
      <div class="song-content" *ngIf="isExpanded" [@expandCollapse]>
        <div class="video-controls" *ngIf="song.youtubeUrl2">
          <button 
            [class.active]="currentSource === 1"
            (click)="setVideoSource(1)"
            class="source-toggle-btn">
            Submission 1
          </button>
          <button 
            [class.active]="currentSource === 2"
            (click)="setVideoSource(2)"
            class="source-toggle-btn">
            Submission 2
          </button>
        </div>
        <div class="video-container" *ngIf="getCurrentVideoUrl(); else noVideo">
          <iframe
            [src]="getSafeUrl(getCurrentVideoUrl()!)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
        <ng-template #noVideo>
          <div class="missing-video">
            <img 
              src="https://placehold.co/600x400?text=Video+Not+Available"
              alt="Video not available"
            />
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .song-item {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      position: relative;
    }

    .song-item.has-video {
      background: linear-gradient(135deg, 
        white 0%, 
        white 60%, 
        rgba(144, 238, 144, 0.2) 100%
      );
    }

    .song-item.no-video {
      background: linear-gradient(135deg, 
        white 0%, 
        white 60%, 
        rgba(255, 99, 71, 0.2) 100%
      );
    }

    .song-diff {
      display: inline-block;
      padding: 0.5em 0.5em 0.5em 0;
      margin: auto 0.5em auto 0;
      border-right: 2px solid black;
      font-weight: bold;
    }

    .song-header {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      cursor: pointer;
      transition: background-color 0.2s;
      position: relative;
      z-index: 1;
    }

    .song-header:hover {
      background-color: rgba(248, 248, 248, 0.7);
    }

    .song-info {
      flex: 2;
      display: flex;
      flex-direction: column;
    }

    .song-title {
      font-weight: bold;
      color: #333;
    }

    .song-subtitle {
      color: #666;
      font-size: 0.9em;
    }

    .song-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .song-duration, .song-genre {
      color: #666;
      font-size: 0.9em;
    }

    .song-content {
      border-top: 1px solid #eee;
      overflow: hidden;
    }

    .video-controls {
      display: flex;
      gap: 8px;
      padding: 8px;
      justify-content: center;
      background: #f5f5f5;
    }

    .source-toggle-btn {
      padding: 6px 12px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      transition: all 0.2s;
    }

    .source-toggle-btn.active {
      background: #28aad1;
      color: white;
      border-color: #28aad1;
    }

    .source-toggle-btn:hover:not(.active) {
      background: #f0f0f0;
    }

    .video-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
    }

    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .missing-video {
      padding: 20px;
      text-align: center;
    }

    .missing-video img {
      max-width: 100%;
      height: auto;
    }
  `]
})
export class SongItemComponent {
  @Input() song!: Song;
  @Input() isExpanded: boolean = false;
  @Output() expandToggle = new EventEmitter<void>();

  currentSource: 1 | 2 = 1;

  constructor(private sanitizer: DomSanitizer) {}

  toggleExpand() {
    this.expandToggle.emit();
  }

  setVideoSource(source: 1 | 2) {
    this.currentSource = source;
  }

  getCurrentVideoUrl(): string | undefined {
    return this.currentSource === 1 ? this.song.youtubeUrl : this.song.youtubeUrl2;
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}