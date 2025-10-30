import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.services';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  // console.log('NotAuthenticatedGuard');

  const authService = inject(AuthService);

  const router = inject(Router);

  const isAuthenticated = await firstValueFrom( authService.checkStatus());

  console.log({isAuthenticated});

  if (isAuthenticated){
    router.navigateByUrl('/');
    return false;
  }

  return true;
}
