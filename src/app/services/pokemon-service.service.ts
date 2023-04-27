import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Pokemon } from '../models/pokemon.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(
    private http: HttpClient,
  ) { }

  public getPokemons(authorId: number): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${environment.urlAPI}/?idAuthor=${authorId}`);
  }

  public createPokemon(authorId: number, pokemon: Pokemon) {
    return this.http.post<any>(`${environment.urlAPI}/?idAuthor=${authorId}`, pokemon);
  }

  public getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${environment.urlAPI}/${id}`);
  }

  public getByQuantity(authorId: number, quantity: number): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${environment.urlAPI}/${quantity}?idAuthor=${authorId}`);
  }

  public updatePokemon(id: number, pokemon: Pokemon) {
    return this.http.put<any>(`${environment.urlAPI}/${id}`, pokemon);
  }

  public deletePokemon(id: number) {
    return this.http.delete<any>(`${environment.urlAPI}/${id}`);
  }

}
