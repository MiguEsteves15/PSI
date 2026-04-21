import { Routes } from '@angular/router';
import { ArtistSearchComponent } from './features/artist-search/artist-search.component';
import { ArtistDetailComponent } from './features/artist-detail/artist-detail.component';
import { ArtistAlbumsComponent } from './features/artist-albums/artist-albums.component';
import { SignupComponent } from './features/signup/signup.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
	{
		path: 'signup',
		component: SignupComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard]
	},
	{
		path: '',
		component: ArtistSearchComponent
	},
	{
		path: 'artists/:id',
		component: ArtistDetailComponent
	},
	{
		path: 'artists/:id/albums',
		component: ArtistAlbumsComponent
	},
	{
		path: '**',
		redirectTo: ''
	}
];
