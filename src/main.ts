import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import{register as regisgterSwiperElements} from 'swiper/element/bundle'
regisgterSwiperElements();
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
