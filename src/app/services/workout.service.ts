import { Injectable } from '@angular/core';

import { workoutData } from '../data/data';
import { WorkoutDataModal } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})

export class WorkoutService {
  private storageKey: string = 'workoutStorage';

  constructor() {
    this.initializeData();
  }

  // Initialize workout data and currentId in localStorage if not already set
  private initializeData() {
    const storedData = localStorage.getItem(this.storageKey);

    if (!storedData) {
      const initialData = {
        currentId: 4,
        workoutData
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  // Helper method to get data from localStorage
  public getStorageData() {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : null;
  }

  // Helper method to set data in localStorage
  public setStorageData(data: { currentId: number, workoutData: WorkoutDataModal[] }) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Adds a new workout to localStorage
  addWorkout(newWorkoutData: WorkoutDataModal) {
    const storedData = this.getStorageData();
    
    const workouts = storedData?.workoutData || [];
    let currentId = storedData?.currentId || 4;

    // Handle missing or incomplete data
    if (!newWorkoutData.name || newWorkoutData.workouts.length === 0) {
      throw new Error('Workout data is incomplete');
    }

    // Limit the number of records to 20
    if (workouts.length >= 20) {
      throw new Error('Maximum of 20 records allowed.');
    }

    // Add new workout and increment the currentId
    workouts.push({
      ...newWorkoutData,
      id: currentId
    });

    currentId += 1;

    this.setStorageData({
      currentId: currentId,
      workoutData: workouts
    });
  }

  // get all workouts
  getAllWorkouts(page: number = 1) {
    const pageSize = 5;
    const startIndex = (page - 1) * pageSize;

    const data = this.getStorageData()?.workoutData;

    // Paginate the data - return only 5 records per page
    const paginatedData = data?.slice(startIndex, startIndex + pageSize);

    return paginatedData;
  }

  // filter data based on workoutType and searchName
  filterWorkouts(workoutType: string | null, searchName: string | null, page: number = 1) {
    // Check if both parameters are not provided
    if (!workoutType && !searchName) {
      throw new Error('At least one filter must be provided: workout type or search name.');
    }

    const data = this.getStorageData().workoutData;

    // Filter the workout data based on the provided filters
    const filteredData = data?.filter((eachWorkOut: WorkoutDataModal) => {

      const workoutMatches = workoutType ?
        eachWorkOut.workouts.some(workout => workout.type.toLowerCase() === workoutType.toLowerCase())
        : true;

      const nameMatches = searchName ?
        eachWorkOut.name.toLowerCase().includes(searchName.toLowerCase())
        : true;

      return workoutMatches && nameMatches;
    });

    // limit to 5 records per page
    const pageSize = 5;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredData?.slice(startIndex, startIndex + pageSize);

    return paginatedData;
  }
}
