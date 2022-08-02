import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Figure } from '../figure.model';
import { FiguresService } from '../figures.service';
import { mimeType } from './mime-type.validator';


@Component({
  selector: 'app-figure-create',
  templateUrl: './figure-create.component.html',
  styleUrls: ['./figure-create.component.css']
})
export class FigureCreateComponent implements OnInit {

  constructor(public figuresService: FiguresService) { }

  form: FormGroup;
  imagePreview: string;
  isLoading = false;
 

  ngOnInit(){
    this.form = new FormGroup({
      'name': new FormControl(null, {validators: [Validators.required]}),
      'franchise': new FormControl(null, {validators: [Validators.required]}),
      'description': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {
        validators: [Validators.required], 
        asyncValidators: [mimeType]})
    });

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

  onCreateFigure(){

    if(this.form.invalid){
      return;
    }
    /*
    const figure: Figure = {
      name: form.value.name,
      description: form.value.description,
      imageUrl: form.value.imageUrl
    };
    */

    this.isLoading = true;
    this.figuresService.addFigures(
      this.form.value.name,
      this.form.value.description,
      this.form.value.franchise,
      this.form.value.image);
    this.form.reset();
  }

}
