import { Routes } from '@angular/router';
import { ArtistSearchComponent } from './features/artist-search/artist-search.component';
import { ArtistDetailComponent } from './features/artist-detail/artist-detail.component';
import { ArtistAlbumsComponent } from './features/artist-albums/artist-albums.component';
import { SignupComponent } from './features/signup/signup.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SplashComponent } from './features/splash/splash.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		component: SplashComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'signup',
		component: SignupComponent
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'search',
		component: ArtistSearchComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'profile',
		component: ProfileComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'artists/:id',
		component: ArtistDetailComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'artists/:id/albums',
		component: ArtistAlbumsComponent,
		canActivate: [AuthGuard]
	},
	{
		path: '**',
		redirectTo: '/login'
	}
];
