import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class UsersService{
    constructor(public http: HttpClient){ }
    
    subscribe(login: string, password: string,avatar: string){
        return new Promise<string>((resolve,reject) => {
            this.http
            .post('http://localhost:8083/subscription',{login,avatar,password})
            .toPromise()
            .then((response:any) => {  
             resolve(response.response)
            })
            .catch(reject)
          })
    }

    login(login:string, password:string){
        return new Promise<string>((resolve,reject) => {
            this.http
            .post('http://localhost:8083/login',{login,password})
            .toPromise()
            .then((response:any) => {
                sessionStorage.setItem('avatar',response.avatar)
              const token = response.token;
              if(token != undefined && token != '' && token != null)
                localStorage.setItem('token',token)
                sessionStorage.setItem('name',login)
                resolve(response.response)
            })
            .catch(reject)
          })
    }

}