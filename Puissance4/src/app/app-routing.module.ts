import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './users/login/login.component'
import { SubscriptionComponent } from './users/subscription/subscription.component'
import { GameComponent } from './games/game/game.component';
import {GamesListeComponent} from './games/games-liste/games-liste.component'

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'subscribe',
    component: SubscriptionComponent
  },
  {
    path: 'games',
    component: GamesListeComponent
  },
  {
    path:'play/:id',
    component: GameComponent
    
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
