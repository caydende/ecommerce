import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { FooterComponent } from "./Layouts/footer/footer.component";
import { NgxSpinner, NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent,NgxSpinnerModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  constructor(private readonly flowbiteService: FlowbiteService) {}


  ngOnInit() {
    this.flowbiteService.loadFlowbite
  }
  title = 'Ecommerce';
}

