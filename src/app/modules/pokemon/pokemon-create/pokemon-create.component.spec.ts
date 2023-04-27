import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule, By } from '@angular/platform-browser';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon-service.service';
import { of } from 'rxjs'

import { PokemonCreateComponent } from './pokemon-create.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PokemonCreateComponent', () => {
  let component: PokemonCreateComponent;
  let fixture: ComponentFixture<PokemonCreateComponent>;
  let pokeService: jasmine.SpyObj<PokemonService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ PokemonCreateComponent ],
      imports: [
        BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        MatIconModule
      ],
      providers: [
        { provide: PokemonService, useFactory: () => {
          return jasmine.createSpyObj<PokemonService>({
            getPokemons: of([] as Pokemon[]),
            createPokemon: of([] as Pokemon[]),
            getPokemonById: of({} as Pokemon),
            getByQuantity: of([] as Pokemon[]),
            updatePokemon: of(),
            deletePokemon: of()
          })
        } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonCreateComponent);
    component = fixture.componentInstance;
    pokeService = TestBed.inject(PokemonService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "Nuevo Pokemon" as title', () => {
    const title = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(title.innerHTML).toBe('Nuevo Pokemon');
  });

  it('should have 4 inputs', () => {
    const form = fixture.debugElement.nativeElement.querySelector('#pokemonForm');
    const inputElementes = form.querySelectorAll('input');
    expect(inputElementes.length).toEqual(4);
  });

  it('form should have initial values', () => {
    const pokemongFormGroup = component.pokemonForm;
    const pokemonFormValues = {
      name: '',
      image: '',
      attack: 0,
      defense: 0
    };
    expect(pokemongFormGroup.value).toEqual(pokemonFormValues);
  });

  it('dom form values should be equal to component form values', () => {
    const nameFormHTML = fixture.debugElement.query(By.css('#nameInput'));
    const imageFormHTML = fixture.debugElement.query(By.css('#imageInput'));
    const attackFormHTML = fixture.debugElement.query(By.css('#attackInput'));
    const defenseFormHTML = fixture.debugElement.query(By.css('#defenseInput'));

    const nameFormComponent = component.pokemonForm.get('name');
    const imageFormComponent = component.pokemonForm.get('image');
    const attackFormComponent = component.pokemonForm.get('attack');
    const defenseFormComponent = component.pokemonForm.get('defense');

    expect(nameFormHTML.properties?.['value']).toEqual(nameFormComponent!.value);
    expect(imageFormHTML.properties?.['value']).toEqual(imageFormComponent!.value);
    expect(Number(attackFormHTML.properties?.['value'])).toEqual(attackFormComponent!.value);
    expect(Number(defenseFormHTML.properties?.['value'])).toEqual(defenseFormComponent!.value);
  });

  it('form validators should be set', () => {
    const nameFormComponent = component.pokemonForm.get('name');
    const imageFormComponent = component.pokemonForm.get('image');

    expect(nameFormComponent!.errors?.['required']).toBeTrue();
    expect(nameFormComponent!.errors?.['minLength']).toBeFalsy();
    expect(imageFormComponent!.errors?.['required']).toBeTrue();
    expect(imageFormComponent!.errors?.['minLength']).toBeFalsy();
  });

  it('form should be valid when validations are fulfilled', () => {
    const nameFormHTML = fixture.debugElement.nativeElement.querySelector('#nameInput');
    const imageFormHTML = fixture.debugElement.nativeElement.querySelector('#imageInput');

    nameFormHTML.value = 'pokemon test';
    imageFormHTML.value = 'url test';
    nameFormHTML.dispatchEvent(new Event('input'));
    imageFormHTML.dispatchEvent(new Event('input'));

    const isFormValid = component.pokemonForm.valid;
    expect(isFormValid).toBeTrue();
  });

  it('create pokemon button should call createPokemon() on click', fakeAsync(() => {
    let spy = spyOn<PokemonCreateComponent, 'createPokemon'>(component, 'createPokemon');
    const nameFormHTML = fixture.debugElement.nativeElement.querySelector('#nameInput');
    const imageFormHTML = fixture.debugElement.nativeElement.querySelector('#imageInput');

    nameFormHTML.value = 'pokemon test';
    imageFormHTML.value = 'url test';
    nameFormHTML.dispatchEvent(new Event('input'));
    imageFormHTML.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    const button = fixture.debugElement.nativeElement.querySelector('#createButton');
    button.click();
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('close pokemon button should call closePokemon() on click', fakeAsync(() => {
    let spy = spyOn<PokemonCreateComponent, 'closePokemon'>(component, 'closePokemon');
    const button = fixture.debugElement.nativeElement.querySelector('#closeButton');
    button.click();
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('should call service', fakeAsync(() => {
    const nameFormHTML = fixture.debugElement.nativeElement.querySelector('#nameInput');
    const imageFormHTML = fixture.debugElement.nativeElement.querySelector('#imageInput');

    nameFormHTML.value = 'pokemon test';
    imageFormHTML.value = 'url test';
    nameFormHTML.dispatchEvent(new Event('input'));
    imageFormHTML.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('#createButton');
    button.click();
    tick();

    expect(pokeService.createPokemon).toHaveBeenCalled();
  }));
});
