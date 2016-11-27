import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome';
import {BookComponent} from './book';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '',      component: WelcomeComponent },
  { path: 'welcome',  component: WelcomeComponent },
  { path: 'book',  component: BookComponent },
  { path: 'about', component: AboutComponent },  
  { path: '**',    component: WelcomeComponent },
];
