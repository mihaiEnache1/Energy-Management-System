import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ShowUsersComponent } from './show-users/show-users.component';
import { AuthGuard } from './_auth/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UserResolverService } from './service/user-resolver.service';
import { AddDeviceComponent } from './add-device/add-device.component';
import { ShowDevicesComponent } from './show-devices/show-devices.component';
import { DeviceResolverService } from './service/device-resolver.service';
import { MapDevicesComponent } from './map-devices/map-devices.component';
import { ShowMyDevicesComponent } from './show-my-devices/show-my-devices.component';
import { ChartComponent } from './chart/chart.component';
import { ChatComponent } from './chat/chat.component';
import { MyChatsComponent } from './my-chats/my-chats.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'show-users', component: ShowUsersComponent, canActivate: [AuthGuard],  data: {role: 'ADMIN'}},
  { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard], data: {role: 'ADMIN'},
    resolve: {
      user: UserResolverService
    }
  }, 
  { path: 'add-device', component: AddDeviceComponent, canActivate: [AuthGuard], data: {role: 'ADMIN'},
    resolve: {
      device: DeviceResolverService
    }
  },
  { path: 'show-devices', component: ShowDevicesComponent, canActivate:[AuthGuard], data: {role: 'ADMIN'} },
  { path: 'map-devices', component: MapDevicesComponent, canActivate: [AuthGuard], data: {role: 'ADMIN'}},
  { path: 'show-my-devices', component: ShowMyDevicesComponent },
  { path: 'chart', component: ChartComponent, canActivate: [AuthGuard], data: {role: 'CLIENT'}},
  { path: 'chat/:uid', component: ChatComponent, canActivate: [AuthGuard], data: {role: 'CLIENT'} }, 
  { path: 'my-chats', component: MyChatsComponent, canActivate: [AuthGuard], data: {role: 'ADMIN'} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
