import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) { }

  login(email: string, senha: string) {
      return this.http.post('/users/authenticate', { email: email, senha: senha })
          .map((response: Response) => {
              // login ok
              let user = response.json();
              if (user && user.token) {
                  // armazena currentUser
                  localStorage.setItem('currentUser', JSON.stringify(user));
              }
              return user;
          });
  }

  logout() {
      // remove currentUser
      localStorage.removeItem('currentUser');
  }
}
