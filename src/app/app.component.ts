import { Component } from '@angular/core';

import { WorkoutFormComponent } from "./components/workout-form/workout-form.component";
import { WorkoutListComponent } from "./components/workout-list/workout-list.component";

@Component({
  selector: 'app-root',
  imports: [
    WorkoutFormComponent,
    WorkoutListComponent
  ],
  templateUrl: './app.component.html',
})


export class AppComponent {

  constructor() {
  
  }
}
