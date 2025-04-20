import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[autoScale]',
  standalone: true
})
export class AutoScaleDirective implements AfterViewInit, OnDestroy {
  private observer: ResizeObserver;

  constructor(private el: ElementRef) {
    this.observer = new ResizeObserver(() => this.scale());
  }

  ngAfterViewInit() {
    this.observer.observe(this.el.nativeElement);
    this.scale();
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

  private scale() {
    const element = this.el.nativeElement;
    const container = element.parentElement;
    if (!container) return;

    // Reset scale to measure true width
    element.style.transform = 'scale(1)';
    
    const containerWidth = container.clientWidth;
    const elementWidth = element.scrollWidth;
    
    if (elementWidth > containerWidth) {
      const scale = containerWidth / elementWidth;
      element.style.transform = `scale(${scale})`;
    }
  }
}