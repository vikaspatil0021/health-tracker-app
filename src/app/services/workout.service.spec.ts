import { TestBed } from '@angular/core/testing';

import { workoutData } from '../data/data';
import { WorkoutData } from '../models/workout.model';

import { WorkoutService } from './workout.service';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
  });

  afterEach(() => {
    localStorage.clear();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  // Testing initializing data into localstorage
  it('should initialize workout data if not present in localStorage', () => {
    const storedData = service.getStorageData();

    expect(storedData).toBeTruthy();
    expect(storedData.currentId).toBe(4);
    expect(Array.isArray(storedData?.workoutData)).toBeTrue();
  });


  // Test helper method getStorageData
  it('should return storedData if available in localstorage else return null', () => {
    let storedData = service.getStorageData();
    expect(storedData).toBeTruthy();

    localStorage.clear();

    storedData = service.getStorageData();
    expect(storedData).toBeNull()
  });

  // Test helper method setStorageData
  it('should set storedData in localstorage', () => {
    localStorage.clear();

    const data = {
      currentId: 4,
      workoutData: workoutData
    };
    service.setStorageData(data);

    let storedData = service.getStorageData();
    expect(storedData).toBeTruthy();
  });


  //Test missing or incomplete data
  it('should throw an error when adding a workout with incomplete data', () => {
    const incompleteWorkout: any = {
      name: 'Incomplete Workout',
      workouts: []
    };

    expect(() => service.addWorkout(incompleteWorkout)).toThrowError('Workout data is incomplete');
  });

  //Test limit of 20 records
  it('should limit the number of stored workouts to 20', () => {
    localStorage.clear();

    for (let i = 0; i < 20; i++) {
      service.addWorkout({ id: i, name: `Workout ${i}`, workouts: [{ type: 'Cycling', minutes: 45 }] });
    }

    expect(() => service.addWorkout({ id: 21, name: 'Overflow', workouts: [{ type: 'Cycling', minutes: 45 }] }))
      .toThrowError('Maximum of 20 records allowed.');
  });

  //Test addition of new workout data
  it('should add a new workout successfully', () => {

    const newWorkout: WorkoutData = {
      name: 'Leg Day',
      workouts: [{ type: 'Cycling', minutes: 45 }]
    };

    service.addWorkout(newWorkout);
    const storedData = service.getStorageData();

    expect(storedData.workoutData.length).toBe(4);
    expect(storedData.workoutData[3].name).toBe('Leg Day');
  });


  // Get all Workouts data tests
  it('should return first 3 workouts by default', () => {

    const result = service.getAllWorkouts();
    expect(result?.length).toBe(3);
  });

  // filtering tests cases
  it('should throw an error when no filters are provided', () => {
    expect(() => service.filterWorkouts(null, null, 1)).toThrowError('At least one filter must be provided: workout type or search name.');
  });

  it('should not throw an error when at least one filter is provided', () => {
    expect(() => service.filterWorkouts('cardio', null)).not.toThrow();
  });

  it('should return an empty array when no workouts match filter criteria', () => {

    const result = service.filterWorkouts('Boxing', 'Nonexistent Name', 1);
    expect(result).toEqual([]);
  });

  it('should filter by workout type and name correctly', () => {

    const result = service.filterWorkouts('Cycling', 'John', 1);
    expect(result?.length).toBe(2);
    expect(result[0].name).toBe('John Doe');
  });

  it('should filter by workout type only', () => {

    const result = service.filterWorkouts('Running', null, 1);
    expect(result?.length).toBe(2);
  });

  it('should filter by name only', () => {

    const result = service.filterWorkouts(null, 'Jane', 1);
    expect(result?.length).toBe(1);
    expect(result[0].name).toBe('Jane Smith');
  });

  it("should return 4 data records based on pagination on page 4", () => {
    localStorage.clear();

    for (let i = 1; i < 20; i++) {
      service.addWorkout({ id: i, name: `Workout ${i}`, workouts: [{ type: 'Running', minutes: 45 }] });
    }

    const result = service.filterWorkouts('Running', null, 4);
    expect(result?.length).toBe(4);
    expect(result[3].name).toBe('Workout 19');

  })


});
