import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon-service.service';
import { of } from 'rxjs';

import { PokemonEditComponent } from './pokemon-edit.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PokemonEditComponent', () => {
  let component: PokemonEditComponent;
  let fixture: ComponentFixture<PokemonEditComponent>;
  let pokeService: jasmine.SpyObj<PokemonService>;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ PokemonEditComponent ],
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: PokemonService, useFactory: () => {
            return jasmine.createSpyObj<PokemonService>({
              getPokemons: of([] as Pokemon[]),
              createPokemon: of([] as Pokemon[]),
              getPokemonById: of({} as Pokemon),
              getByQuantity: of([] as Pokemon[]),
              updatePokemon: of({} as Pokemon),
              deletePokemon: of()
            })
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonEditComponent);
    component = fixture.componentInstance;
    component.pokemon = [pokemonArray[0]];
    pokeService = TestBed.inject(PokemonService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have pokemon name as title', fakeAsync(() => {
    const title = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(title.innerHTML).toBe(pokemonArray[0].name);
  }));

  it('should have 4 inputs', () => {
    const form = fixture.debugElement.nativeElement.querySelector('#pokemonForm');
    const inputElementes = form.querySelectorAll('label');
    expect(inputElementes.length).toEqual(4);
  });

  it('form should have initial values', () => {
    const pokemongFormGroup = component.pokemonForm;
    const pokemonFormValues = {
      name: pokemonArray[0].name,
      image: pokemonArray[0].image,
      attack: pokemonArray[0].attack,
      defense: pokemonArray[0].defense
    };
    expect(pokemongFormGroup.value).toEqual(pokemonFormValues);
  });

  it('dom form values should be equal to component form values', fakeAsync(() => {
    fixture.detectChanges();
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
  }));

  it('form validators should be set', () => {
    const nameFormComponent = component.pokemonForm.get('name');
    const imageFormComponent = component.pokemonForm.get('image');

    expect(nameFormComponent!.errors?.['required']).toBeFalsy();
    expect(nameFormComponent!.errors?.['minLength']).toBeFalsy();
    expect(imageFormComponent!.errors?.['required']).toBeFalsy();
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

  it('edit pokemon button should call editPokemon() on click', fakeAsync(() => {
    let spy = spyOn<PokemonEditComponent, any>(component, 'editPokemon');
    const nameFormHTML = fixture.debugElement.nativeElement.querySelector('#nameInput');
    const imageFormHTML = fixture.debugElement.nativeElement.querySelector('#imageInput');

    nameFormHTML.value = 'pokemon test';
    imageFormHTML.value = 'url test';
    nameFormHTML.dispatchEvent(new Event('input'));
    imageFormHTML.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    const button = fixture.debugElement.nativeElement.querySelector('#editButton');
    button.click();
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('close pokemon button should call closePokemon() on click', fakeAsync(() => {
    let spy = spyOn<PokemonEditComponent, any>(component, 'closePokemon');
    const button = fixture.debugElement.nativeElement.querySelector('#closePokemon');
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

    const button = fixture.debugElement.nativeElement.querySelector('#editButton');
    button.click();
    tick();

    expect(pokeService.updatePokemon).toHaveBeenCalled();
  }));
});
