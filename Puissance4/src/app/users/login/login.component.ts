import { Component, OnInit } from '@angular/core';
import { UsersService} from '../users.service'
import { AppComponent} from '../../app.component'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: string
  password: string
  reponse: string = ''

  constructor(private usersService: UsersService, public appComponent:AppComponent) { }

  ngOnInit() {
  }

  loginCo(){
      this.usersService
      .login(this.login,this.password)
      .then(response2 => {
        this.reponse = response2
        if(response2 == 'Connexion reussi')
        this.appComponent.loadProfil()} )
      .catch(e => console.error(e))
  }
}
