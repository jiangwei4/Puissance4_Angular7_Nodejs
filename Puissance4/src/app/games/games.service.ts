import { Injectable } from '@angular/core';
import Game from './game/game';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class gamesService {
  public games: Game
  public joueurs: string[]
  public GameId:string
  
  constructor(public http: HttpClient) { 
   
  }

  public loadJoueur(){
    const token = localStorage.getItem('token')
    const option = {headers:{}}
    if(token){
      option.headers = new HttpHeaders({
      Authorization: token})
    }
    return new Promise<[]>((resolve, reject) => {
      this.http
    .post<any>('http://localhost:8083/joueurs',{},option)
    .toPromise()
    .then(response => {
      this.joueurs = response.utilisateurs
      resolve(response.utilisateurs)
    })
    .catch(reject)
  })
  }

  public lancerPartie(login){
    const token = localStorage.getItem('token')
    const option = {headers:{}}
    if(token){
      option.headers = new HttpHeaders({
      Authorization: token})
    }
    return new Promise((resolve, reject) => {
        this.http
      .post<any>('http://localhost:8083/newGame',{login},option)
      .toPromise()
      .then(response => {
       // alert(response.response)
        resolve(response.games)
      })
      .catch(reject)
    })
  }

  public loadGames(){
    const token = localStorage.getItem('token')
    const option = {headers:{}}
    if(token){
      option.headers = new HttpHeaders({
      Authorization: token})
    }
    return new Promise<Game[]>((resolve, reject) => {
      this.http
    .post<any>('http://localhost:8083/games',{},option)
    .toPromise()
    .then(response => {
      this.games = response.games
      resolve(response.games)
    })
    .catch(reject)
  })
  }

  public setGameId(val){
    this.GameId = val
  }

  public getGame(){
    return this.games
  }

  public loadGrille(){
    const token = localStorage.getItem('token')
    const option = {headers:{}}
    if(token){
      option.headers = new HttpHeaders({
      Authorization: token})
    }
    return new Promise<Game>((resolve, reject) => {
      this.http
    .post<Game>('http://localhost:8083/grilleget',{'GameId':this.GameId},option)
    .toPromise()
    .then(response => {
      this.games = response.game
      resolve(response.game)
    })
    .catch(reject)
  })
}


  public deplacement(position){
      const token = localStorage.getItem('token')
      const option = {headers:{}}
      if(token){
        option.headers = new HttpHeaders({
        Authorization: token})
      }
      return new Promise<Game>((resolve, reject) => {
        this.http
      .post<any>('http://localhost:8083/grille',{'GameId':this.GameId,position},option)
      .toPromise()
      .then(response => {
        resolve(response)
      })
      .catch(reject)
    })
  }

  public merde(){
    return 'coucou'
  }
}
