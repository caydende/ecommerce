import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly httpClient = inject(HttpClient)

  private readonly router = inject(Router)
  userData:any = null

  sendRegister(data: object):Observable<any>{
  return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, data )
  }

  sendLogin(data: object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signin`, data)
  }

  saveUserData():any{
    if(localStorage.getItem("authToken") !== null){
    this.userData =   jwtDecode(localStorage.getItem("authToken") !)
    }
  }

  logOut():void{
    localStorage.removeItem("authToken")
    localStorage.removeItem("cartId")
    this.userData = null
    this.router.navigate(["/login"])
  }

  forgotVerifyEmail(email: object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, email)}

  forgotVerifyCode(code: object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, code)}
  
    resetPassword(data: object):Observable<any>{
      return this.httpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, data)}
}
