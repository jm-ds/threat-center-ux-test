import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-api-explorer',
  templateUrl: './api-explorer.component.html',
  styleUrls: ['./api-explorer.component.scss']
})
export class ApiExplorerComponent implements OnDestroy {
  private scriptEl: HTMLScriptElement;

  constructor() {
    this.addGraphQLExplorerScript();
  }

  private addGraphQLExplorerScript() {
    const headEl = document.querySelector('head');

    this.scriptEl = document.createElement('script');

    this.scriptEl.src = 'https://embeddable-explorer.cdn.apollographql.com/_latest/embeddable-explorer.umd.production.min.js';

    headEl.append(this.scriptEl);
  }

  ngOnDestroy() {
    this.scriptEl.remove();
  }
}
