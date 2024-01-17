import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCommonModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { CommonModule } from '@angular/common';
import { Theme, ThemeService } from './theme.service';
import { Observable, Subscription } from 'rxjs';
import { NotificationsComponent } from './notifications/notifications.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
    NotificationsComponent,
    MainMenuComponent,
  ],
  providers: [ThemeService],
  selector: 'spaceribs-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  subs: Subscription = new Subscription();
  theme$: Observable<Theme>;

  constructor(
    private themeService: ThemeService,
    iconRegistry: MatIconRegistry,
  ) {
    this.theme$ = themeService.getTheme();
    iconRegistry.setDefaultFontSetClass('material-symbols-sharp');
  }

  ngOnInit(): void {
    this.themeService.setTheme('light');
  }
}
