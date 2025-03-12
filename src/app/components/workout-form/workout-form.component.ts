import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { SelectOptions, Workout } from '../../models/workout.model';

import { WorkoutService } from '../../services/workout.service';


@Component({
  selector: 'app-workout-form',
  imports: [
    Card,
    Select,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './workout-form.component.html',
})


export class WorkoutFormComponent {

  formGroup: FormGroup;
  workoutTypes: Workout[] = [];
  workoutOptions: SelectOptions[] = [
    { "name": "Cycling", "code": "Cycling" },
    { "name": "Running", "code": "Running" },
    { "name": "Swimming", "code": "Swimming" },
    { "name": "Yoga", "code": "Yoga" }
  ];

  workoutService = inject(WorkoutService);

  constructor() {
    this.formGroup = new FormGroup({
      user_name: new FormControl<string>("", [Validators.required]),
      selected_workout_type: new FormControl<SelectOptions | null>(null, [Validators.required]),
      minutes: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
    });
  }

  // handling addition of multiple workout types
  handle_add_workout_type() {

    const workoutType = this.formGroup.get('selected_workout_type')?.value as SelectOptions;
    const minutes = this.formGroup.get('minutes')?.value as number;

    if (workoutType && minutes) {
      this.workoutTypes.push({
        type: workoutType.code,
        minutes: minutes
      });


      // Reset fields and clear validation errors with (emitEvent :false)
      this.formGroup.get('selected_workout_type')?.reset(null, { emitEvent: false });
      this.formGroup.get('minutes')?.reset(null, { emitEvent: false });

      if (this.workoutTypes.length >= 4) {
        this.formGroup.controls['selected_workout_type'].disable();
        this.formGroup.controls['minutes'].disable();
      }
    }
  }

  // remove workouttype based on id for now 
  handle_remove_workout_type(index: number) {
    this.workoutTypes = this.workoutTypes.filter((each: Workout, idx: number) => idx !== index);

    if (this.workoutTypes.length < 4) {
      this.formGroup.controls['selected_workout_type'].enable();
      this.formGroup.controls['minutes'].enable();
    }
  }

  handle_add_new_workout_data() {
    const user_name = this.formGroup.get('user_name')?.value as string;

    if (user_name && this.workoutTypes.length > 0) {
      this.workoutService.addNewWorkout({
        name: user_name,
        workouts: this.workoutTypes
      });

      this.workoutTypes = [];
      this.formGroup.get('user_name')?.reset(null, { emitEvent: false });
      this.formGroup.get('selected_workout_type')?.reset(null, { emitEvent: false });
      this.formGroup.get('minutes')?.reset(null, { emitEvent: false });

      if (this.workoutTypes.length < 4) {
        this.formGroup.controls['selected_workout_type'].enable();
        this.formGroup.controls['minutes'].enable();
      }
    }
  }
}
