import { Component, OnInit } from '@angular/core';
import { FiguresService } from '../figures.service';
import { Figure } from '../figure.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-figure-details',
  templateUrl: './figure-details.component.html',
  styleUrls: ['./figure-details.component.css']
})
export class FigureDetailsComponent implements OnInit {

  figure: Figure;
  private figuresSub: Subscription;

  figureId: number;

  admin:boolean;

  constructor(public figuresService: FiguresService, public route: ActivatedRoute) {}   // "public" keyword allows to directly declare a property




  ngOnInit(){

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')){
        this.figureId = +paramMap.get('id');
        this.figuresService.getFigure(this.figureId);
        this.figuresSub = this.figuresService.getFigureUpdateListener().subscribe((figure: Figure) => {
        this.figure = figure;
        
      });

      }
    });

    //console.log(this.figure.imageUrl);


    this.admin = this.figuresService.getMode();

  }


  onEditFigure(form: NgForm){

    const id = this.figureId;

    this.figuresService.updateFigure(
      id,
      form.value.name,
      form.value.description,
      form.value.franchise,
      null
    );

    console.log(id);


  }


}
