import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpClient = inject(HttpClient)
  cartItemsNum:WritableSignal<number> = signal(0)


  addToCart(id:string):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/cart` , {
      "productId": id
    })
  }

  updateQuantity(newCount:number , id:string):Observable<any>{
    return this.httpClient.put(`${environment.baseUrl}/api/v1/cart/${id}` , {
      "count": newCount
    })
  }

  getUserCart():Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart`)
  }

  removeSpecificeProduct(id:string):Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`)
  }

  clearCartItems():Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart`)
  }

}
