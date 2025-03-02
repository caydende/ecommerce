import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn , Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';


export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router)
    const id = inject(PLATFORM_ID)
    const toaster = inject(ToastrService)
    if(isPlatformBrowser(id)){
      if(localStorage.getItem("authToken") !== null){
        return true
      }else{
        router.navigate(["/login"])
        toaster.warning("you don't have the preemption to enter this url" , "Fresh Cart")
        return false
      }
    }else{
    return false
    }
    
};
