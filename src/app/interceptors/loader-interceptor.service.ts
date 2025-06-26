import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);

  // Liste des URLs à ignorer
  const ignoredUrls = ['/api/stations/nearbyStations'];

  const shouldIgnore = ignoredUrls.some((url) => req.url.includes(url));

  if (shouldIgnore) {
    return next(req); // Pas de loader
  }

  loader.show();

  return next(req).pipe(finalize(() => loader.hide()));
};
