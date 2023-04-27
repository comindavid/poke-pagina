import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { PokemonCreateComponent } from './pokemon-create/pokemon-create.component';
import { PokemonEditComponent } from './pokemon-edit/pokemon-edit.component';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { PokemonComponent } from './pokemon.component';
import { MatIconModule } from '@angular/material/icon';

const routes: Route[] = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    },
    {
        path     : '',
        component: PokemonComponent,
        children: [
            { path: 'list', component: PokemonListComponent }
        ]
    }
];

@NgModule({
    declarations: [
        PokemonComponent,
        PokemonListComponent,
        PokemonCreateComponent,
        PokemonEditComponent
  ],
    imports     : [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule
    ]
})
export class PokemonModule
{
}
