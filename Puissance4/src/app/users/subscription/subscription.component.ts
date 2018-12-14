import { Component, OnInit } from '@angular/core';
import { UsersService} from '../users.service'

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  avatar: string
  login: string
  password: string
  reponse: string = ''
  constructor(private usersService: UsersService) { 

  }
  ngOnInit() {
  }
  subscribeCo(){

    this.usersService
    .subscribe(this.login,this.password,this.avatar)
    .then(response => this.reponse = response)
    .catch(e => console.error(e))
}
}
