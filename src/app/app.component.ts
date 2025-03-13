import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, inject, NgZone } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import { initFlowbite } from 'flowbite';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements AfterViewInit {
  private readonly flowbiteService = inject(FlowbiteService)
  private readonly router = inject(Router)
  private readonly ngZone = inject(NgZone);


  ngAfterViewInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
    this.flowbiteService.loadFlowbite((flowbite) => {
      flowbite.initFlowbite();
    })
  }})}
  title = 'Ecommerce';
}
