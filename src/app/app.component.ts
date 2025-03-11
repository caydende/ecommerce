import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import {NgxSpinnerModule} from 'ngx-spinner';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  private readonly flowbiteService = inject(FlowbiteService)
  

  ngOnInit() {
    this.flowbiteService.loadFlowbite
  }
  title = 'Ecommerce';
}

