import { Component, OnDestroy, OnInit } from '@angular/core';
import { FiguresService } from '../figures.service';
import { Figure } from '../figure.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { mimeType } from '../figure-create/mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-figure-details',
  templateUrl: './figure-details.component.html',
  styleUrls: ['./figure-details.component.css']
})
export class FigureDetailsComponent implements OnInit {

  form: FormGroup;
  imagePreview: string;

  figure: Figure;
  private figuresSub: Subscription;

  figureId;
  userId: string;

  isLoading: boolean = false;
  //admin: boolean;
  userIsAuthenticated = false;

  constructor(public figuresService: FiguresService, public route: ActivatedRoute, private authService: AuthService) { }   // "public" keyword allows to directly declare a property

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.figureId = +paramMap.get('id');
        this.figuresService.getFigure(this.figureId);
        this.figuresSub = this.figuresService.getFigureUpdateListener().subscribe((figure: Figure) => {
          this.figure = figure;
        });
      }
    });

    //this.admin = this.figuresService.getMode();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();


    this.form = new FormGroup({
      'name': new FormControl(null, { validators: [Validators.required] }),
      'franchise': new FormControl(null, { validators: [Validators.required] }),
      'description': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null,{
        validators: [Validators.required], 
        asyncValidators: [mimeType]})
    });


    //PROGRAMMATIC-APPROACH FPR SETTING THE DEFAULT VALUES (instead of [ngModel])

    /*
    this.form.setValue(
      {name: this.figure.name, 
        franchise: this.figure.franchise, 
        description: this.figure.description, 
        imagePath: this.figure.imagePath}
      );

      */


  }

  onImagePicked(event: Event){
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = <string>reader.result;
      };
      reader.readAsDataURL(file);
  }


/*
  onEditFigure(form: NgForm) {

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

*/

  onEdit() {

    if (this.form.invalid) {
      return;
    }
    
    this.isLoading = true;

    this.figuresService.updateFigure(
      this.figureId,
      this.form.value.name,
      this.form.value.description,
      this.form.value.franchise,
      this.form.value.image);

    this.isLoading = false;
  }

  onDelete(id: number) {
    if (confirm("Are you sure to delete this figure?")) {
      this.figuresService.deleteFigure(this.figureId);
    }
  }
  


}
