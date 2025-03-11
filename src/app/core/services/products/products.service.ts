import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../../../shared/interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly httpClient = inject(HttpClient)

  products:IProduct[] = []

  getAllProducts():Observable<any>{
    return this.httpClient.get("https://ecommerce.routemisr.com/api/v1/products")
  }



  getSpecificProduct(id:string | null):Observable<any>{
    return this.httpClient.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
  }

}
