import { NgZone, Component } from '@angular/core';
import { Router, RouterLink} from '@angular/router';

import { AppState } from '../app.service';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'welcome',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './welcome.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
    showmore: boolean  = false
    constructor(private router: Router, private ngZone: NgZone) {
        var value = Office.context.roamingSettings.get('showWelcomeV1');
        if (value === false) {
          this.ngZone.run(() => {
            //this.router.navigateByUrl('/book');
          });
        }

    }

    next() {
        Office.context.roamingSettings.set('showWelcomeV1', false);
        Office.context.roamingSettings.saveAsync((res) => {
           this.ngZone.run(() => {
            this.router.navigateByUrl('/book');
           });            
        });
    }

    more() {
        this.showmore = true;
    }
}
