import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Figure } from '../figure.model';
import { FiguresService } from '../figures.service';

@Component({
  selector: 'app-figure-list',
  templateUrl: './figure-list.component.html',
  styleUrls: ['./figure-list.component.css']
})
export class FigureListComponent implements OnInit, OnDestroy {

  figures: Figure[] = [];
  private figuresSub: Subscription;
  private authStatusSub: Subscription;

  isLoading = false;

  totalFigures = 10;
  figuresPerPage = 5;
  currentPage = 0;
  pageSizeOptions = [1,2,5,10];

  //admin: boolean;
  userIsAuthenticated = false;
  userId: string;

  constructor(public figuresService: FiguresService, private authService: AuthService) { }   // "public" keyword allows to directly declare a property

  ngOnInit() {
    this.isLoading = true;
    this.figuresService.getFigures(this.figuresPerPage, this.currentPage, "");   // NULL because of searchParam
    this.figuresSub = this.figuresService.getFiguresUpdateListener().subscribe((figures: Figure[]) => {
      this.figures = figures;
      this.isLoading = false;
    });

    //this.admin = this.figuresService.getMode();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();

      }
    );

    this.totalFigures = this.figuresService.getFigureCount();
    //console.log(this.userId);

  }

  onChangedPage(pageData: PageEvent){
    
    this.isLoading = true;
    this.currentPage = pageData.pageIndex;
    this.figuresPerPage = pageData.pageSize;
    this.figuresService.getFigures(this.figuresPerPage,this.currentPage,"");   // NULL because of searchParam
   
    this.totalFigures = this.figuresService.getFigureCount();

  }

  onDelete(id: number) {
    if (confirm("Are you sure to delete this figure?")) {
      this.figuresService.deleteFigure(id);
    }
  }

  ngOnDestroy() {
    this.figuresSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
