import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MyInterceptor } from "./interceptor";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ChangepasswordComponent } from "./changepassword/changepassword.component";
import { HostpitalComponent } from "./hostpital/hostpital.component";
import { ToastrModule } from "ngx-toastr";
import { NotfoundComponent } from "./notfound/notfound.component";
import { MaterialModule } from "./material.module";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChangepasswordComponent,
    HostpitalComponent,
    NotfoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    AngularFontAwesomeModule,
    MaterialModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
