import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  baseUrl = 'https://pokeapi.co/api/v2'
  imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

  constructor(private http: HttpClient) { }

  getPokemon(offset = 0) {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=25`)
      .pipe(
        map(res => {
          return res['results'];
        }),
        map(pokemons => {
          return pokemons.map((poke, index) => {
            poke.index = index + offset + 1;
            poke.image = this.getPokemonImageUrl(poke.index);
            return poke;
          })
        })
      );
  }

  getPokemonImageUrl(index) {
    return `${this.imageUrl}${index}.png`;
  }

  findPokemon(search) {
    return this.http.get(`${this.baseUrl}/pokemon/${search}`).pipe(
      map(pokemon => {
        pokemon['image'] = this.getPokemonImageUrl(pokemon['id']);
        pokemon['index'] = pokemon['id'];
        return pokemon;
      })
    )
  }

  getPokemonDetails(index) {
    return this.http.get(`${this.baseUrl}/pokemon/${index}`)
      .pipe(
        map(poke => {
          let sprites = Object.keys(poke['sprites']);
          poke['images'] = sprites
            .map(spriteKey => poke['sprites'][spriteKey])
            .filter(img => img);
          return poke;
        })
      )
  }
}
