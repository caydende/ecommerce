import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const logedINGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const id = inject(PLATFORM_ID)
  const toaster = inject(ToastrService)
  if(isPlatformBrowser(id)){

  if(localStorage.getItem("authToken") !== null){
    router.navigate(["/home"])
    toaster.warning("you don't have the preemption to enter this url" , "Fresh Cart")
    return false 

  }else{

    return true
  }
  }else {
    return false
  }

};
