import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Router} from'@angular/router'
import{gamesService} from './games/games.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Puissance_4';
  Name = ''
  Avatar = 'https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg'
  webSocket: any
  constructor(public http: HttpClient, public router: Router, public gamesService:gamesService){ 
    this.Avatar = sessionStorage.getItem('avatar')
    this.Name = sessionStorage.getItem('name')
    
  }
  ngOnInit(){
    this.WebSocket2()
  }
  
  deconnexion(){
    sessionStorage.setItem('avatar','')
    sessionStorage.setItem('name','')
    const token = localStorage.getItem('token')
    const option = {headers:{}}
    if(token){
      option.headers = new HttpHeaders({
      Authorization: token})
    }
     new Promise((resolve,reject) => {
        this.http
        .post('http://localhost:8083/deconnexion',{},option)
        .toPromise()
        .then((response:any) => {
            sessionStorage.setItem('token','')
            location.reload()
            this.router.navigateByUrl('/')
        })
        .catch(reject)
      })
  }

  route(path){
    this.router.navigateByUrl(path)
  }

  WebSocket2(){
    if(this.webSocket){
      return}
    this.webSocket = new WebSocket('ws://localhost:8084')
    this.webSocket.onopen = (ws => {
      this.webSocket.send('Hello angular!')
     })
     this.webSocket.onmessage = (message => {
       if(this.Name == message.data.replace('reload ',''))
            this.gamesService.loadGrille()
 })
  }

}
