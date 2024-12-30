import { Injectable, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { PopupMessageComponent } from '../components/shared/popup-message.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popupRef: ComponentRef<PopupMessageComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    // Remove any existing popup
    this.close();

    // Create the component
    const componentRef = createComponent(PopupMessageComponent, {
      environmentInjector: this.injector,
      hostElement: document.createElement('div')
    });

    // Set the component properties
    Object.assign(componentRef.instance, {
      message,
      type,
      onClose: () => this.close()
    });

    // Add to DOM and attach to application
    document.body.appendChild(componentRef.location.nativeElement);
    this.appRef.attachView(componentRef.hostView);

    this.popupRef = componentRef;
  }

  private close() {
    if (this.popupRef) {
      const element = this.popupRef.location.nativeElement;
      element.parentNode?.removeChild(element);
      this.popupRef.destroy();
      this.popupRef = null;
    }
  }
}