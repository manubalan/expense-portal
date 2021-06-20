import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material.module';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    MatSidenavModule,
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (loc: PlatformLocation) => loc.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
