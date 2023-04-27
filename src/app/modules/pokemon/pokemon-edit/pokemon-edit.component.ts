import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-pokemon-edit',
  templateUrl: './pokemon-edit.component.html',
  styleUrls: ['./pokemon-edit.component.scss']
})
export class PokemonEditComponent implements OnInit {

  @Input() pokemon: Pokemon[] = [];
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
    this.pokemonForm.patchValue({
      name: this.pokemon[0].name,
      image: this.pokemon[0].image,
      attack: this.pokemon[0].attack,
      defense: this.pokemon[0].defense
    });
  }

  editPokemon() {
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
    this.pokemonService.updatePokemon(this.pokemon[0].id, model).subscribe(d => {
      if(d.id) {
        this.event.emit("edit");
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
