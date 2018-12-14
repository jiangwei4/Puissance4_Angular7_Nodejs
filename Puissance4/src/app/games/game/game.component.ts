import { Component, OnInit , Input} from '@angular/core';
import Game from './game';
import{gamesService} from '../games.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  GameId : string
  Grille: Game = {
    game: "",
    id: "",
    loginA: "",
    loginB: "",
    playe: "",
}
  positionPossile: string[]= ['A','B','C','D','E','F','G','H']
  position:string = 'A'
  pion:string[] = ['https://m.mcdn.fr/files/images/article/8/8/3/1051388/vignette-focus.jpg','https://www.ask-securite.com/media/catalog/product/cache/4/image/800x800/9df78eab33525d08d6e5fb8d27136e95/m/8/m861-04-franken-symbole-magnetique-cercle-10-jaune-image.jpg']
  reponse: string = ' '

  @Input() games: Game
  constructor(private gamesService: gamesService, private route: ActivatedRoute) { 
    this.route.params.subscribe(params=> this.GameId = params.id)
    gamesService.setGameId(this.GameId)
    gamesService.loadGrille().then(response => this.Grille = response);

    let x = setInterval(() => this.loadEvery5sec(),1000)
    
  }

  ngOnInit() {
  }
  
  deplacement(pos){
    this.position = pos
    this.gamesService.deplacement(this.position).then((response2:any) => {
   // this.reponse = response
      if(response2.bug != '' && response2.bug != undefined){
      this.reponse = response2.bug
      } 
      console.log(response2)
    this.gamesService.loadGrille().then(response => this.Grille = response)})
  }

  loadEvery5sec(){
   this.Grille = this.gamesService.getGame()
  }
}
