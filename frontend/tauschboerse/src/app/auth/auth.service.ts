import { _getFocusedElementPierceShadowDom } from "@angular/cdk/platform";
import { HttpClient } from "@angular/common/http";
import { TransitiveCompileNgModuleMetadata } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: 'root'})
export class AuthService {

    private token: string;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer: any;
    private userId: string;

    constructor(private httpClient: HttpClient, private router: Router){}

    getToken(){
        return this.token;
    };

    getIsAuth(){
        return this.isAuthenticated;
    };

    getUserId(){
        return this.userId;
    };

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    };

    createUser(email:string, password: string){
        const authData: AuthData = {email: email, password: password};
        this.httpClient.post("http://localhost:3000/api/user/signup", authData)
        .subscribe(() => {
            this.router.navigate["/"];
        });
    };


    login(email:string, password: string){
        const authData: AuthData = {email: email, password: password};
        this.httpClient.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", authData)
        .subscribe( response => {
            //console.log(response.userId);
            const token = response.token;
            this.token = token;
            if(token){ 
                this.authStatusListener.next(true);
                this.isAuthenticated = true;
                this.router.navigate(['/']);
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.userId = response.userId;

                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                this.saveAuthData(token,expirationDate, this.userId);
                console.log(expirationDate);               
                console.log(expiresInDuration);
            }
        });
    };

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }

        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;
    }

    private setAuthTimer(duration: number){
        console.log("Setting timer: " + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string){
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");

    }

    getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");

        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }
}