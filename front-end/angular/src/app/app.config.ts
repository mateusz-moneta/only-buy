import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { appInitializer } from '@core/initializers';
import { authInterceptor, errorInterceptor } from '@core/interceptors';
import { getDefaultLang } from '@shared/utils';
import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(appInitializer),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideRouter(routes),
    provideTransloco({
      config: {
        availableLangs: ['en', 'pl'],
        defaultLang: getDefaultLang(),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
