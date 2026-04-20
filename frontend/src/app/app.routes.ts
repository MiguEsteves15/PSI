import { Routes } from '@angular/router';
import { ArtistSearchComponent } from './features/artist-search/artist-search.component';
import { ArtistDetailComponent } from './features/artist-detail/artist-detail.component';
import { ArtistAlbumsComponent } from './features/artist-albums/artist-albums.component';

export const routes: Routes = [
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
