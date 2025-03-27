import { Injectable } from '@angular/core';

import { workoutData } from '../data/data';

import { Subject } from 'rxjs';

import { StorageData, WorkoutDataModal } from '../models/workout.model';



@Injectable({
  providedIn: 'root'
})


export class WorkoutService {
  private storageKey: string = "workoutservice";

  // Using Subject<void> to capture the addNewWorkout event so that updated data can reflected on the screen :)
  public updateEvent$: Subject<void>;

  constructor() {
    this.initializeDefaultData();

    this.updateEvent$ = new Subject<void>();
  }

  // Initialize workout data and currentId in localStorage if not already set
  private initializeDefaultData() {
    const data = this.getData();

    if (!data) {
      this.setData({ currentId: 4, workoutData })
    }
  }

  // Helper method to get data from localStorage
  public getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ?
      JSON.parse(data) as StorageData
      : null;
  }

  // Helper method to set data in localStorage
  public setData(props: StorageData) {
    localStorage.setItem(this.storageKey, JSON.stringify(props));
  }

  // Adds a new workout to localStorage
  public addNewWorkout(newWorkoutData: WorkoutDataModal) {
    const { currentId, workoutData } = this.getData() as StorageData;

    // Handle missing or incomplete data
    if (!newWorkoutData.name || newWorkoutData.workouts.length === 0) {
      throw new Error('Workout data is incomplete');
    }

    // Limit the number of records to 20
    if (workoutData.length >= 20) {
      throw new Error('Maximum of 20 records allowed.');
    }

    workoutData.push({
      ...newWorkoutData,
      id: currentId
    });


    this.setData({
      currentId: currentId + 1,
      workoutData
    });

    this.updateEvent$.next();
  }

  // Get all workout based on page number
  public getAllWorkout(page: number = 1, itemsPerPage: number = 5) {
    const { workoutData } = this.getData() as StorageData;

    const start_index = itemsPerPage * (page - 1);
    return workoutData.slice(start_index, start_index + itemsPerPage);
  }

  // Filter workout based on workoutType and searchName
  public filterWorkouts(workoutType: string | null, searchName: string | null, page: number = 1, itemsPerPage: number = 5) {

    // Check if both parameters are not provided
    if (!workoutType && !searchName) {
      throw new Error('At least one filter must be provided: workout type or search name.');
    }

    const { workoutData } = this.getData() as StorageData;

    const filteredData = workoutData?.filter((each: WorkoutDataModal) => {
      const nameMatches = searchName ? each.name.toLowerCase().includes(searchName.toLowerCase()) : true;
      const workoutMatches = workoutType ? each.workouts.some(workout => workout.type.toLowerCase() === workoutType.toLowerCase()) : true;

      return workoutMatches && nameMatches;
    });

    const startIndex = (page - 1) * itemsPerPage;
    return filteredData?.slice(startIndex, startIndex + itemsPerPage);
  }
}
