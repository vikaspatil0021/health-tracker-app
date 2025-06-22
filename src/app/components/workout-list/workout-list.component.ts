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

    // filter data based on search_keyword and select_filter_value
    this.formGroup.valueChanges.subscribe(({ search_keyword, select_filter_value }) => {
      this.updateWorkoutDataonFilter(search_keyword, select_filter_value)
    })
  }

  // initailize or update when new workoutdata event is emitted 
  initailizeOrUpdateData() {
    this.totalRecords = this.workoutService.getData()?.workoutData.length as number;
    this.workOutData = this.workoutService.getAllWorkout(this.currentPage, this.itemsPerPage);
  }

  // update workoutData based on change in either filters on pagination
  updateWorkoutDataonFilter(search_keyword: string, select_filter_value: SelectionFilterOptions) {
    
    if (search_keyword !== "" || select_filter_value.code !== 'All')
      this.workOutData = this.workoutService.filterWorkouts(select_filter_value.code, search_keyword, this.currentPage, this.itemsPerPage);
    else
      this.workOutData = this.workoutService.getAllWorkout(this.currentPage, this.itemsPerPage);
  }

  onPageChange(event: PaginatorState) {
    const { search_keyword, select_filter_value } = this.formGroup.value as { search_keyword: string, select_filter_value: SelectionFilterOptions };

    if (event.page !== undefined && event.rows !== undefined) {
      this.currentPage = event.page + 1;
      this.itemsPerPage = event.rows as number;

      this.updateWorkoutDataonFilter(search_keyword, select_filter_value)
    }
  }

  getTotalMinutes(eachData: WorkoutDataModal): number {
    return eachData.workouts.reduce((acc: number, workout: Workout) => acc + (workout.minutes), 0);
  }




}
