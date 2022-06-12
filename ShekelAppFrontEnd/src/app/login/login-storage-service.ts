import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrivateStringsForApp } from '../common/PrivateStringsForApp';

@Injectable({
  providedIn: 'root'
})

// Login storage service class.
export class LoginStorageService {
  // For when fields in the class needs to be empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()
  // User's fields.
  private username: string = this.emptyString
  private password: string = this.emptyString
  // User's token.
  private token: string = this.emptyString

  constructor(private http: HttpClient) { }

  // This function is called when user is submitting the login form, for getting 
  // is token from the system.
  getUserToken(username: string, password: string): Observable<HttpResponse<Object>> {
    this.username = username
    this.password = password
    return this.http.post("http://localhost:8080/login", { "userName": username, "password": password }, { observe: 'response' })
  }

  // This function is called when user is submitting the login form, for getting 
  // his user roles array by the token from the system .
  clientType(token: string): Observable<String[]> {
    return this.http.get<String[]>("http://localhost:8080/api/login", { headers: new HttpHeaders({ Authorization: token }) })
  }

  // This function is called for preventing entry to the system from the url segment, 
  // when user enters the system.
  checkLoginFields(): boolean {
    return this.username === this.emptyString || this.password === this.emptyString
  }

  // This function is called when user is login out from the system.
  resetLoginFields(): void {
    this.username = this.emptyString
    this.password = this.emptyString
    this.token = this.emptyString
  }

  // This function is called when user is login the system for checking if the password
  //  is default or updated.
  isPasswordUpdated(): boolean {
    return this.password !== PrivateStringsForApp.getDefaultPasswordString()
  }

  // Getters and Setters:

  getUsername(): string {
    return this.username.toString()
  }

  getPassword(): string {
    return this.password.toString()
  }

  getToken(): string {
    return this.token.toString()
  }

  setToken(token: string): void {
    this.token = token
  }

}
