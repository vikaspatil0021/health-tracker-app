import { Injectable } from '@angular/core';

import { workoutData } from '../data/data';
import { WorkoutData } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})

export class WorkoutService {
  private storageKey: string = 'workoutStorage';

  constructor() {
    this.initializeWorkouts();
  }

  // Initialize workout data and currentId in localStorage if not already set
  private initializeWorkouts() {
    const storedData = localStorage.getItem(this.storageKey);
    if (!storedData) {
      const initialData = {
        currentId: 4,
        workoutData: workoutData
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  // Helper method to get data from localStorage
  private getStorageData() {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : null;
  }

  // Helper method to set data in localStorage
  private setStorageData(data: { currentId: number, workoutData: WorkoutData }) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Adds a new workout to localStorage
  addWorkout(newWorkoutData: WorkoutData) {
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
}
