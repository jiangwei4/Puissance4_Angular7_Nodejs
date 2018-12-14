import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import{gamesService} from '../games.service';
import Game from '../game/game';
import {Router} from'@angular/router'

@Component({
  selector: 'app-games-liste',
  templateUrl: './games-liste.component.html',
  styleUrls: ['./games-liste.component.css']
})
export class GamesListeComponent implements OnInit {
  games: Game[] = []
  joueurs: string[] = []
  joueurVS: string
  game:any
 // @Output() newMessage = new EventEmitter()

  constructor(private gamesService: gamesService, public router: Router) { 
    this.load()
    gamesService.loadJoueur().then(joueurs => this.joueurs = joueurs).catch(e=>console.log(e))
  }
  
  ngOnInit() {
  }

  lancerPartie(){
    if(this.joueurVS != '' && this.joueurVS != null && this.joueurVS!= undefined)
    this.gamesService.lancerPartie(this.joueurVS).then(() => this.load()).catch(e => console.log(e))
  }

   load(){
    this.gamesService.loadGames().then(games => { this.games = games})
  }
  
  jouer(GameId){
    this.router.navigateByUrl('/play/'+GameId)
  }

}
