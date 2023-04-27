import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-pokemon-create',
  templateUrl: './pokemon-create.component.html',
  styleUrls: ['./pokemon-create.component.scss']
})
export class PokemonCreateComponent implements OnInit {

  @Output() event = new EventEmitter<string>();

  pokemonForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    image: new FormControl('', [Validators.required, Validators.minLength(1)]),
    attack: new FormControl(0),
    defense: new FormControl(0)
  })

  constructor(
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
  }

  createPokemon() {
    this.pokemonForm.markAsTouched();
    if(!this.pokemonForm.valid) {
      return;
    };
    let model: Pokemon = {
      ...this.pokemonForm.getRawValue(),
      id: 0,
      hp: 0,
      type: "Unknown",
      idAuthor: 1
    };
    this.pokemonService.createPokemon(1, model).subscribe(d => {
      if(d.id) {
        this.event.emit("save");
      }
      if(!d.success) {
        console.log(d)
      }
    });
  };

  closePokemon() {
    this.event.emit("close");
  }
}
