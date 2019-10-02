import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../environments/environment';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <header-component></header-component>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer-component></footer-component>
  `,
})
export class AppComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: string,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  public ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      const bases = this.document.getElementsByTagName('base');

      if (bases.length > 0) {
        bases[0].setAttribute('href', environment.baseHref);
      }
    }
  }
}
