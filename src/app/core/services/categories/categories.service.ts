import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private readonly httpClient = inject(HttpClient)

  getAllCategories():Observable<any>{
    return this.httpClient.get("https://ecommerce.routemisr.com/api/v1/categories");
  }

  getSpecificCategory(id:string):Observable<any>{
    return this.httpClient.get(`https://ecommerce.routemisr.com/api/v1/categories/${id}`);
  }

}
