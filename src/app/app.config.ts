
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { loadingScreensInterceptor } from './core/interceptors/loadingscreens/loading-screens.interceptor';
import { errorInterceptor } from './core/interceptors/error/error.interceptor';
import { headersInterceptor } from './core/interceptors/headers/headers.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(),withInterceptors([loadingScreensInterceptor,errorInterceptor,headersInterceptor])),
    provideToastr(),
    provideAnimations(),
    importProvidersFrom(NgxSpinnerModule , ToastrModule.forRoot({
      timeOut: 1500,
      progressBar: true ,
      preventDuplicates:true,

    }),),
    ]

};
