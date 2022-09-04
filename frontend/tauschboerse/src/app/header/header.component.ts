import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
    userIsAuthenticated = false;
    userId: string;
    private authListenerSubs: Subscription;

    constructor(private authService: AuthService){}

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.userId = this.authService.getUserId();
        this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            //this.userId = this.authService.getUserId();
        });
    }

    onLogout(){
        this.authService.logout();
        
    }

    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();
    }

}