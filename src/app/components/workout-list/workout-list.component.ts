import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectionFilterOptions, Workout, WorkoutDataModal } from '../../models/workout.model';

import { CommonModule } from '@angular/common';
import { WorkoutService } from '../../services/workout.service';


@Component({
  selector: 'app-workout-list',
  imports: [
    Select,
    TableModule,
    InputTextModule,
    PaginatorModule,
    FloatLabelModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './workout-list.component.html',
})


export class WorkoutListComponent {
  // pagination variables
  totalRecords: number = 5;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  formGroup: FormGroup;
  workOutData!: WorkoutDataModal[];

  workout_filter_options: SelectionFilterOptions[] = [
    { "name": "All", "code": "All" },
    { "name": "Cycling", "code": "Cycling" },
    { "name": "Running", "code": "Running" },
    { "name": "Swimming", "code": "Swimming" },
    { "name": "Yoga", "code": "Yoga" }
  ];

  workoutService = inject(WorkoutService);

  constructor() {
    this.formGroup = new FormGroup({
      search_keyword: new FormControl<string>(""),
      select_filter_value: new FormControl<SelectionFilterOptions>({ "name": "All", "code": "All" })
    });

    this.initailizeOrUpdateData();

    this.workoutService.updateEvent$.subscribe(() => {
      this.initailizeOrUpdateData();
    })
  }

  initailizeOrUpdateData() {
    this.totalRecords = this.workoutService.getData()?.workoutData.length as number;
    this.workOutData = this.workoutService.getAllWorkout(this.currentPage, this.itemsPerPage);
  }

  onPageChange(event: PaginatorState) {
    if (event.page !== undefined && event.rows != undefined) {
      this.currentPage = event.page + 1;
      this.itemsPerPage = event.rows as number;
      this.workOutData = this.workoutService.getAllWorkout(event.page + 1, this.itemsPerPage);
    }
  }

  getTotalMinutes(eachData: WorkoutDataModal): number {
    return eachData.workouts.reduce((acc: number, workout: Workout) => acc + (workout.minutes), 0);
  }




}
