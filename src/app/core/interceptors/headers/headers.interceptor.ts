import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  if(localStorage.getItem("authToken")){
      let Headers:any = {token : localStorage.getItem("authToken")}
  req = req.clone({
    setHeaders : Headers
  })
  }

  return next(req);
};
  