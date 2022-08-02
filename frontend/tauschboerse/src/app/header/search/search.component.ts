import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FiguresService } from 'src/app/figures/figures.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router, public figuresService: FiguresService) { }

  ngOnInit(): void {
  }

  doSearch(value: string){
    console.log(`value=${value}`);
    this.router.navigateByUrl(`/search/${value}`);

    this.figuresService.getFigures(1,0, value);   // NULL because of searchParam


  }

}
