import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';
import{GamesListeComponent}from './games-liste/games-liste.component'

@NgModule({
  declarations: [GamesListeComponent, GameComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    GamesListeComponent
  ]
})
export class GamesModule { }
