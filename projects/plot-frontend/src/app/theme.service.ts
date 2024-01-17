import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable()
export class ThemeService implements OnDestroy {
  subs: Subscription = new Subscription();
  private theme$ = new Subject<Theme>();

  constructor(@Inject(DOCUMENT) private document: Document) {
    const themeSub = this.theme$.subscribe((theme) => {
      this.document.body.setAttribute('data-theme', theme);
    });
    this.subs.add(themeSub);
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  public getTheme() {
    return this.theme$.asObservable();
  }

  public setTheme(theme: Theme): void {
    this.theme$.next(theme);
  }
}
