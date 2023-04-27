import { Component, OnInit } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {

  title: string = "Listado de Pokemon";
  pokemonList: Array<Pokemon> = [];
  pokemonListBackup: Array<Pokemon> = [];
  searchInput: string = '';
  showCreate: boolean = false;
  showEdit: boolean = false;

  constructor(
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    this.initialize();
  };

  initialize() {
    this.pokemonService.getPokemons(1).subscribe(d => {
      this.pokemonList = d;
      this.pokemonListBackup = this.pokemonList;
    })
  }

  searchPokemon() {
    this.showCreate = false;
    this.showEdit = false;
    this.title = "Listado de Pokemon";
    if(this.searchInput == '') {
      this.pokemonList = this.pokemonListBackup;
    } else {
      this.pokemonList = this.pokemonListBackup.filter(pokemons => pokemons.name.toLowerCase().includes(this.searchInput.toLowerCase()));
    }
  }

  createPokemon() {
    this.pokemonList = [];
    this.showEdit = false;
    this.showCreate = true;
    this.title = "Crear Pokemon";
    this.searchInput = '';
  }

  editPokemon(pokemon: Pokemon) {
    this.pokemonList = [pokemon];
    this.showCreate = false;
    this.showEdit = true;
    this.title = "Editar Pokemon";
  }

  deletePokemon(pokemon: Pokemon) {
    this.pokemonListBackup.splice(this.pokemonListBackup.indexOf(pokemon), 1);
    this.pokemonList = this.pokemonListBackup;
    this.pokemonService.deletePokemon(pokemon.id).subscribe(d=>{});
  }

  editEvent(event: string) {
    this.showCreate = false;
    this.showEdit = false;
    if(event == "close") {
      this.pokemonList = this.pokemonListBackup;
    } else {
      this.initialize();
    };
    this.searchInput = '';
    this.title = "Listado de Pokemon";
  };

  saveEvent(event: string) {
    this.showCreate = false;
    this.showEdit = false;
    if(event == "close") {
      this.pokemonList = this.pokemonListBackup;
    } else {
      this.initialize();
    };
    this.title = "Listado de Pokemon";
  }

}
