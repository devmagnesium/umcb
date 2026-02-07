import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ConfigService } from './services/config';

export function initConfig(config: ConfigService) {
  return () => config.load();
}

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true
    }
  ]
})
export class AppModule {}
