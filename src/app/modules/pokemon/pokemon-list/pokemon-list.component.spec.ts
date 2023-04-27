import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon-service.service';
import { of } from 'rxjs';

import { PokemonListComponent } from './pokemon-list.component';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokeService: jasmine.SpyObj<PokemonService>;
  let pokemonArray: Array<Pokemon> = [
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
      declarations: [ PokemonListComponent ],
      imports: [
        FormsModule
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
    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    pokeService = TestBed.inject(PokemonService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('title should be "Listado de pokemon" when the table is displayed', () => {
    const title = fixture.debugElement.query(By.css('.title')).nativeElement;

    expect(title.innerHTML).toEqual('Listado de Pokemon');
    expect(component.showCreate).toBeFalse();
    expect(component.showEdit).toBeFalse();
    expect(component.title).toEqual('Listado de Pokemon');
  });

  it('title should be "Crear Pokemon" when PokemonCreateComponent is being shown', fakeAsync(() => {
    const button = fixture.debugElement.nativeElement.querySelector('#createPokemon');
    button.click();
    tick();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.title')).nativeElement;

    expect(title.innerHTML).toEqual('Crear Pokemon');
    expect(component.showCreate).toBeTrue();
    expect(component.showEdit).toBeFalse();
    expect(component.title).toEqual('Crear Pokemon');
  }));

  it('title should be "Editar Pokemon" when PokemonEditComponent is being shown', fakeAsync(() => {
    component.pokemonList = pokemonArray;
    tick();
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('#editPokemon');
    button.click();
    tick();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.title')).nativeElement;

    expect(title.innerHTML).toEqual('Editar Pokemon');
    expect(component.showCreate).toBeFalse();
    expect(component.showEdit).toBeTrue();
    expect(component.title).toEqual('Editar Pokemon');
  }));

  it('should call service to get pokemon array', () => {
    component.ngOnInit();
    expect(pokeService.getPokemons).toHaveBeenCalled();
  });

  it('should load table with one row per pokemon in array', fakeAsync(() => {
    component.pokemonList = pokemonArray;
    tick();
    fixture.detectChanges();
    const table = fixture.debugElement.nativeElement.querySelector('table');
    const rows = table.querySelectorAll('#pokemonRows');
    expect(rows.length).toEqual(pokemonArray.length);
  }));

  it('should load table with correct data per column', fakeAsync(() => {
    component.pokemonList = pokemonArray;
    tick();
    fixture.detectChanges();
    const table = fixture.debugElement.nativeElement.querySelector('table');
    const rows = table.querySelectorAll('#pokemonRows');
    rows.forEach((row: any, i: number) => {
      expect(row.querySelector('#pokemonName').innerHTML).toEqual(pokemonArray[i].name);
      expect(row.querySelector('#pokemonImage').getAttribute('src')).toEqual(pokemonArray[i].image);
      expect(Number(row.querySelector('#pokemonAttack').innerHTML)).toEqual(pokemonArray[i].attack);
      expect(Number(row.querySelector('#pokemonDefense').innerHTML)).toEqual(pokemonArray[i].defense);
    });
  }));

  it('search bar should change searchInput value', fakeAsync(() => {
    let input = fixture.debugElement.query(By.css('#searchBar'));
    let el = input.nativeElement;
    el.value = '2';
    el.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.searchInput).toBe('2');
  }));

  it('create button should open create component and clear table', fakeAsync(() => {
    component.pokemonList = pokemonArray;
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('#createPokemon');
    button.click();
    tick();
    fixture.detectChanges();
    const { debugElement } = fixture;
    const create = debugElement.query(By.css('app-pokemon-create'));
    expect(create).toBeTruthy();
    expect(component.showCreate).toBeTrue();
    expect(component.pokemonList.length).toEqual(0);
  }));

  it('edit button should open edit component and change table to selected pokemon', fakeAsync(() => {
    component.pokemonList = pokemonArray;
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelectorAll('#editPokemon');
    button[0].click();
    tick();
    fixture.detectChanges();
    const { debugElement } = fixture;
    const edit = debugElement.query(By.css('app-pokemon-edit'));
    expect(edit).toBeTruthy();
    expect(component.showEdit).toBeTrue();
    expect(component.pokemonList).toEqual([pokemonArray[0]]);
  }));

  it('delete button should call delete from service', fakeAsync(() => {
    component.pokemonList = pokemonArray;
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelectorAll('#deletePokemon');
    button[2].click();
    tick();
    fixture.detectChanges();
    expect(pokeService.deletePokemon).toHaveBeenCalled();
  }));
});
