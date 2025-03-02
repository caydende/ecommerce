import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  detailsProd:IProduct | null = null;


  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly products = inject(ProductsService)

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next:(p) => {
        let prodId = p.get('id')  
        this.products.getSpecificProduct(prodId).subscribe({
          next:(res) => {
            console.log(res.data)
            this.detailsProd= res.data;
          },error:(err) => {
            console.log(err)
          }
        })

      }
    })
  }

}
