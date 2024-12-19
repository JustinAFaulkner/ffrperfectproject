import { Injectable, ApplicationRef, ComponentRef, Type, createComponent, EnvironmentInjector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalComponentRef: ComponentRef<any> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open<T extends object>(component: Type<T>, props: Partial<T> = {}): ComponentRef<T> {
    this.closeModal();

    const componentRef = createComponent(component, {
      environmentInjector: this.injector,
      hostElement: document.createElement('div')
    });

    Object.assign(componentRef.instance, props);

    document.body.appendChild(componentRef.location.nativeElement);
    this.appRef.attachView(componentRef.hostView);

    this.modalComponentRef = componentRef;

    return componentRef;
  }

  closeModal() {
    if (this.modalComponentRef) {
      const element = this.modalComponentRef.location.nativeElement;
      element.parentNode?.removeChild(element);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
    }
  }
}