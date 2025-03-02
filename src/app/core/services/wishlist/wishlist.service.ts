import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient)

  addToWishlist(prodId:string):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist` , {
      "productId" : prodId
    })
  }

  removeFromWishlist(prodId:string):Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${prodId}`)
  }
  getUserWishlist():Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`)
  }

}
