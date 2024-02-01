import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RegisterComponent } from './register/register.component';
import { MatRadioModule } from '@angular/material/radio';
import { ShowUsersComponent } from './show-users/show-users.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AuthGuard } from './_auth/auth.guard';
import { MatTableModule } from '@angular/material/table';
import { AddUserComponent } from './add-user/add-user.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { ShowDevicesComponent } from './show-devices/show-devices.component';
import { MapDevicesComponent } from './map-devices/map-devices.component';
import { MatSelectModule } from '@angular/material/select';
import { ShowMyDevicesComponent } from './show-my-devices/show-my-devices.component';
import { ToastrModule } from 'ngx-toastr';
import { ChartComponent } from './chart/chart.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ChatComponent } from './chat/chat.component';
import { MyChatsComponent } from './my-chats/my-chats.component';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ShowUsersComponent,
    ForbiddenComponent,
    AddUserComponent,
    AddDeviceComponent,
    ShowDevicesComponent,
    MapDevicesComponent,
    ShowMyDevicesComponent,
    ChartComponent,
    ChatComponent,
    MyChatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatSelectModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatDividerModule
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
