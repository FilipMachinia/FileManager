import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FileExplorerComponent} from './file-explorer/file-explorer.component';
import {HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    FileExplorerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // HttpClientModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
