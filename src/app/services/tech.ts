import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
 providedIn:'root'
})
export class TechService{

 constructor(private http:HttpClient){}

 search(q:string){

   return this.http.get<string[]>(
     `http://localhost:3000/tech/suggest?q=${q}`
   );

 }

}
