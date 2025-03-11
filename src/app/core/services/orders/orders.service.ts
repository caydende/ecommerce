import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly httpClient = inject(HttpClient)

  checkOut(cartId:string , details:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`
      ,{
        "shippingAddress": details
      }
    )
  }
  cashOrder(cartId:string , details:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/${cartId}?url=http://localhost:4200`
      ,{
        "shippingAddress": details
      }
    )
  }

  getUserOrder():Observable<any>{
  return this.httpClient.get(`${environment.baseUrl}/api/v1/orders/user/${localStorage.getItem('userId')}`)
  }
}
