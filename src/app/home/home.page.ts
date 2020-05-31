import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  offset = 0;
  pokemon = [];

  @ViewChild(IonInfiniteScroll)
  infinite: IonInfiniteScroll;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemon();
  }

  onSearchChange(event) {
    let value = event.detail.value;

    if (!value) {
      this.offset = 0;
      this.loadPokemon();
      return;
    }

    this.pokemonService.findPokemon(value).subscribe(res => {
      this.pokemon = [res];
    }, err => {
      this.pokemon = [];
    });
  }

  loadPokemon(loadMore = false, event?) {
    if (loadMore) {
      this.offset += 25;
    }
    this.pokemonService.getPokemon(this.offset).subscribe(res => {
      console.log(res);
      this.pokemon = [...this.pokemon, ...res];

      if (event) {
        event.target.complete();
      }

      if (this.offset == 125) {
        this.infinite.disabled = true;
      }
    });
  }
}
