import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { OrdersService } from '../../core/services/orders/orders.service';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { SimilarProductsComponent } from '../../shared/components/business/similar-products/similar-products.component';

@Component({
  selector: 'app-allorders',
  imports: [RouterLink,CurrencyPipe,SimilarProductsComponent],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit{

  private readonly ordersService = inject(OrdersService)

  orders:WritableSignal<any> = signal([])
  stars = new Array(5);
  halfStar(rating:number){
    rating = rating - Math.floor(rating)
    if(rating >= 0.5 ){
      return true
    }else{
      return false
    }
  }

  getUserOrder():void{
          this.ordersService.getUserOrder().subscribe({
          next:(res)=>{
            this.orders.set(res)
            console.log(res)
          }
      })
  }

  ngOnInit(): void {
      this.getUserOrder()
  }
}
