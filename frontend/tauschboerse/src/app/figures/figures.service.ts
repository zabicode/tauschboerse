import { Injectable } from "@angular/core";
import { Figure } from "./figure.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class FiguresService {
    private figures: Figure[] = [];
    private figuresUpdated = new Subject<Figure[]>();

    private figureUpdated = new Subject<Figure>();
    private figureDetails: Figure;

    private figureCount;


    private adminMode = true;

    constructor(private httpClient: HttpClient){}



    getMode(){
        return this.adminMode; 
    }

    getFigureCount(){
        return this.figureCount;
    }

    getFigures(figurePerPage: number, currentPage: number, searchParam: string){
        const queryParams = `?&pagesize=${figurePerPage}&page=${currentPage}&search=${searchParam}`;
        this.httpClient.get<{message: string, figures: Figure[], count: number}>("http://localhost:3000/api/figures" + queryParams)
        .subscribe(figureData => {
            this.figures = figureData.figures;
            this.figuresUpdated.next([...this.figures]);
            this.figureCount = figureData.count;
        });
    }

    /*
    getFigures(figurePerPage: number, currentPage: number){
        const queryParams = `?&pagesize=${figurePerPage}&page=${currentPage}`;
        this.httpClient.get<{message: string, figures: Figure[], count: number}>("http://localhost:3000/api/figures" + queryParams)
        .subscribe(figureData => {
            this.figures = figureData.figures;
            this.figuresUpdated.next([...this.figures]);
            this.figureCount = figureData.count;
        });
    }

    */

    getFigure(id: number){
        this.httpClient.get<{message: string, figure: Figure}>('http://localhost:3000/api/figures/' + id)
        .subscribe(figureData => {
            //console.log(figureData);
            this.figureDetails = figureData.figure;
            this.figureUpdated.next(this.figureDetails);
        });
    }


    getFiguresUpdateListener(){
        return this.figuresUpdated.asObservable();
    }

    getFigureUpdateListener(){
        return this.figureUpdated.asObservable();
    }

    addFigures(name:string, description: string, franchise: string, image: File){
        const figureData = new FormData();
        figureData.append("name", name);
        figureData.append("description", description);
        figureData.append("franchise", franchise);
        figureData.append("image", image, name );

        this.httpClient.post<{message: string, figure: Figure}>('http://localhost:3000/api/figures',figureData)
        .subscribe(responseData => {
            const figure: Figure = {
                id: responseData.figure.id,
                name: name,
                description: description,
                franchise: franchise,
                imagePath: responseData.figure.imagePath
                
            };
            //console.log(responseData.message);
            this.figures.push(figure);
            this.figuresUpdated.next([...this.figures]);
        });
    }

    /*
    addFigures(name:string, description: string, imageUrl: string, franchise: string){
        const figure: Figure = {id: null, name: name, description: description, imageUrl: imageUrl, franchise: franchise};
        this.httpClient.post<{message: string}>('http://localhost:3000/api/figures',figure)
        .subscribe(responseData => {
            console.log(responseData.message);
            this.figures.push(figure);
            this.figuresUpdated.next([...this.figures]);
        });
    }
    */

    updateFigure(id: number, name:string, description: string, franchise: string, imagePath:string){

        const figure: Figure = {id: id, name: name, description: description, franchise: franchise, imagePath:imagePath};

        this.httpClient.put<{message: string}>("http://localhost:3000/api/figures/"+ id, figure)
        .subscribe(responseData => {
            //console.log(responseData.message);
            const figure: Figure = {
                id: id,
                name: name,
                description: description,
                franchise: franchise,
                imagePath: imagePath
            };
            this.figures.push(figure);
            this.figuresUpdated.next([...this.figures]);
        });
    }

    deleteFigure(id:number){
        this.httpClient.delete("http://localhost:3000/api/figures/"+ id)
        .subscribe(() => {
            const updatedFigures = this.figures.filter(figure => figure.id != id);
            this.figures = updatedFigures;
            this.figuresUpdated.next([...this.figures]);
        });
    }

}