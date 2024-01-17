import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [MatIconModule, MatDividerModule, MatListModule, RouterModule],
  providers: [],
  selector: 'spaceribs-main-menu',
  templateUrl: './main-menu.component.html',
})
export class MainMenuComponent {
  constructor(private router: Router) {}

  isActive(path: string) {
    return this.router.isActive(path, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
