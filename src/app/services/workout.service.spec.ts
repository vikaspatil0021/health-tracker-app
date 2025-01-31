import { TestBed } from '@angular/core/testing';

import { WorkoutService } from './workout.service';
import { WorkoutData } from '../models/workout.model';


describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
    localStorage.clear(); // Ensure clean localStorage before testing.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize workout data if not present in localStorage', () => {
    service = new WorkoutService();
    const storedData = JSON.parse(localStorage.getItem('workoutStorage')!);
    expect(storedData).toBeTruthy();
    expect(storedData.currentId).toBe(4);
    expect(Array.isArray(storedData?.workoutData)).toBeTrue();
  });

  it('should add a new workout successfully', () => {
    service = new WorkoutService();

    const newWorkout: WorkoutData = {
      name: 'Leg Day',
      workouts: [{ type: 'Cycling', minutes: 45 }]
    };

    service.addWorkout(newWorkout);
    const storedData = JSON.parse(localStorage.getItem('workoutStorage')!);
    console.log(service,storedData?.workoutData)
    expect(storedData.workoutData.length).toBe(4);
    expect(storedData.workoutData[3].name).toBe('Leg Day');
  });

  it('should throw an error when adding a workout with incomplete data', () => {
    const incompleteWorkout: any = {
      name: 'Incomplete Workout',
      workouts: []
    };

    expect(() => service.addWorkout(incompleteWorkout)).toThrowError('Workout data is incomplete');
  });

  it('should limit the number of stored workouts to 20', () => {
    for (let i = 0; i < 20; i++) {
      service.addWorkout({ id: i, name: `Workout ${i}`, workouts: [{ type: 'Cycling', minutes: 45 }] });
    }

    expect(() => service.addWorkout({ id: 21, name: 'Overflow', workouts: [{ type: 'Cycling', minutes: 45 }] }))
      .toThrowError('Maximum of 20 records allowed.');
  });
});
