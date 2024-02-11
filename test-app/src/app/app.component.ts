import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test-app';

  constructor(private router: Router) {
    const config = this.router.config;

    // Extract and log information about each route
    config.forEach((route: Route) => {
      console.log(`Path: ${route.path}, Component: ${route.component?.name}`);
    });
  }
  
}



