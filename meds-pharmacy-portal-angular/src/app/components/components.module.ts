import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatProgressBarModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoaderService } from '../views/services/loader.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule,
    MatIconModule,
    FlexLayoutModule,
    MatTooltipModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,

  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  providers: [
    LoaderService
  ],
})
export class ComponentsModule { }
