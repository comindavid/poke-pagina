import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { PokemonService } from './pokemon-service.service';
import { Pokemon } from '../models/pokemon.model';
import { HttpClient, HttpResponse } from '@angular/common/http';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;
  let pokemon: Pokemon;
  let httpClient: HttpClient;
  let apiUrl: 'https://bp-pokemons.herokuapp.com';


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient)
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPokemons(authorId) should get all pokemons by author id', () => {
    let pokemonArray: Pokemon[] = [
      {
        id: 1,
        name: 'Test pokemon',
        image: 'url',
        attack: 2,
        defense: 2,
        hp: 15,
        type: 'unknown',
        idAuthor: 1
      },
      {
        id: 2,
        name: 'Test pokemon 2',
        image: 'url',
        attack: 2,
        defense: 2,
        hp: 15,
        type: 'unknown',
        idAuthor: 1
      },
    ];

    service.getPokemons(1).subscribe((res) => {
      expect(res).toEqual(pokemonArray);
    });

    const req = httpMock.expectOne(`https://bp-pokemons.herokuapp.com/?idAuthor=1`);

    expect(req.request.method).toEqual("GET");

    req.flush(pokemonArray);
  });

  it('getPokemonById(id) should get a pokemon by id', () => {
    pokemon = {
      id: 1,
      name: 'Test pokemon',
      image: 'url',
      attack: 2,
      defense: 2,
      hp: 15,
      type: 'unknown',
      idAuthor: 1
    };

    service.getPokemonById(1).subscribe((res) => {
      expect(res).toEqual(pokemon);
    });

    const req = httpMock.expectOne(`https://bp-pokemons.herokuapp.com/1`);

    expect(req.request.method).toEqual("GET");

    req.flush(pokemon);
  });

  it('getByQuantity(authorId, quantity) should get pokemons by author id, quantity results', () => {
    let pokemonArray: Pokemon[] = [
      {
        id: 1,
        name: 'Test pokemon',
        image: 'url',
        attack: 2,
        defense: 2,
        hp: 15,
        type: 'unknown',
        idAuthor: 1
      },
      {
        id: 2,
        name: 'Test pokemon 2',
        image: 'url',
        attack: 2,
        defense: 2,
        hp: 15,
        type: 'unknown',
        idAuthor: 1
      },
      {
        id: 3,
        name: 'Test pokemon 3',
        image: 'url',
        attack: 2,
        defense: 2,
        hp: 15,
        type: 'unknown',
        idAuthor: 1
      },
    ];

    service.getByQuantity(1, 3).subscribe((res) => {
      expect(res).toEqual(pokemonArray);
    });

    const req = httpMock.expectOne(`https://bp-pokemons.herokuapp.com/3?idAuthor=1`);

    expect(req.request.method).toEqual("GET");

    req.flush(pokemonArray);
  });

  it('createPokemon(authorId, pokemon) should create a pokemon and return it', () => {
    const newPokemon: Pokemon = {
      id: 1,
      name: 'Test pokemon',
      image: 'url',
      attack: 2,
      defense: 2,
      hp: 15,
      type: 'unknown',
      idAuthor: 1
    };

    service.createPokemon(1, newPokemon).subscribe( resizeTo => {
      expect(resizeTo).toEqual(newPokemon);
    });

    const req = httpMock.expectOne(`https://bp-pokemons.herokuapp.com/?idAuthor=1`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newPokemon);

    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: newPokemon });
    req.event(expectedResponse);
  });

  it('updatePokemon(pokemonId, pokemon) should update a pokemon', () => {
    const pokemon : Pokemon = {
      id: 1,
      name: 'Test pokemon',
      image: 'url',
      attack: 2,
      defense: 2,
      hp: 15,
      type: 'unknown',
      idAuthor: 1
    };

    service.updatePokemon(pokemon.id, pokemon).subscribe( res => {
      expect(res).toEqual(pokemon);
    });


    const req = httpMock.expectOne(`https://bp-pokemons.herokuapp.com/${pokemon.id}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(pokemon);
  });

  it('deletePokemon(pokemonId) should delete a pokemon', () => {
    service.deletePokemon(1).subscribe( res => {
      expect(res.success).toEqual(true);
    });

    const req = httpMock.expectOne(`https://bp-pokemons.herokuapp.com/1`);
    expect(req.request.method).toEqual('DELETE');
  });
});
