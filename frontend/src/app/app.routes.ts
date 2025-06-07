import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import {ViewPageComponent} from './view-page/view-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'room/:id', component: RoomComponent },
  { path: 'room/:id/view', component: ViewPageComponent},
  { path: '**', redirectTo: '' }
];