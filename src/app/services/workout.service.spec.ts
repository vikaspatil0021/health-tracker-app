import { TestBed } from '@angular/core/testing';

import { workoutData } from '../data/data';

import { WorkoutService } from './workout.service';

import { WorkoutDataModal } from '../models/workout.model';


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

  // Test initialization
  it("should initialize workout data if not present in localstorage", () => {
    const data = service.getData();

    expect(data).toBeTruthy();
    expect(data?.currentId).toBe(4);
    expect(data?.workoutData.length).toBe(3);
  });

  // Test helper method - getData
  it("should return storageData if available in localstorage else return null", () => {
    let data = service.getData();
    expect(data).toBeTruthy();

    localStorage.clear();

    data = service.getData();
    expect(data).toBeNull();
  });

  // Test helper method - setData
  it("should set storageData in localstorage", () => {
    localStorage.clear();

    const data = {
      currentId: 4,
      workoutData: workoutData
    };
    service.setData(data);

    let storedData = service.getData();
    expect(storedData).toBeTruthy();
  });

  // Test missing or incomplete data - addNewWorkout
  it('should throw an error when adding a workout with incomplete data', () => {
    const props = {
      name: "Incomplete workout",
      workouts: []
    };

    expect(() => service.addNewWorkout(props)).toThrowError("Workout data is incomplete")
  });

  // Test max cap of 20 records - addNewWorkout
  it("should limit the number of stored workouts to 20", () => {

    for (let i = 4; i <= 20; i++) {
      service.addNewWorkout({ id: i, name: `Workout ${i}`, workouts: [{ type: 'Cycling', minutes: 45 }] });
    }

    expect(() => service.addNewWorkout({ id: 21, name: 'Overflow', workouts: [{ type: 'Cycling', minutes: 45 }] }))
      .toThrowError('Maximum of 20 records allowed.');
  });

  // Test addition of new workout data - addNewWorkout
  it('should add a new workout successfully', () => {
    const props = {
      name: 'New Data',
      workouts: [{ type: 'Cycling', minutes: 45 }]
    } as WorkoutDataModal;

    service.addNewWorkout(props);
    const data = service.getData();

    expect(data?.currentId).toBe(5);
    expect(data?.workoutData[3].name).toBe("New Data")
  });

  // Test get all workouts data based on page number - getAllWorkout
  it("should return records based on page number", () => {
    for (let i = 4; i <= 17; i++) {
      service.addNewWorkout({ id: i, name: `Workout ${i}`, workouts: [{ type: 'Cycling', minutes: 45 }] });
    }

    const data1 = service.getAllWorkout();
    const data2 = service.getAllWorkout(4);

    expect(data1[0].name).toBe("John Doe")
    expect(data1.length).toBe(5);

    expect(data2[0].name).toBe("Workout 16")
    expect(data2.length).toBe(2);
  })

   // Test error on missing filter inputs
  it('should throw an error when no filters are provided', () => {
    expect(() => service.filterWorkouts(null, null, 1)).toThrowError('At least one filter must be provided: workout type or search name.');
  });

  // Test do not throw error if atleast one input provided
  it('should not throw an error when at least one filter is provided', () => {
    expect(() => service.filterWorkouts('cardio', null)).not.toThrowError();
  });

  // Test return empty array if no match is found
  it('should return an empty array when no workouts match filter criteria', () => {

    const result = service.filterWorkouts('Boxing', 'Nonexistent Name', 1);
    expect(result).toEqual([]);
  });

  // Test filter data based on both inputs
  it('should filter by workout type and name correctly', () => {

    const result = service.filterWorkouts('Cycling', 'John', 1);
    expect(result?.length).toBe(2);
    expect(result[0].name).toBe('John Doe');
  });

  // Test filter data based on workout type only
  it('should filter by workout type only', () => {

    const result = service.filterWorkouts('Running', null, 1);
    expect(result?.length).toBe(2);
  });

  // Test filter data based on name only
  it('should filter by name only', () => {

    const result = service.filterWorkouts(null, 'Jane', 1);
    expect(result?.length).toBe(1);
    expect(result[0].name).toBe('Jane Smith');
  });

  // return records based on pagination after filtering
  it("should return 4 data records based on pagination on page 4", () => {

    for (let i = 4; i <= 20; i++) {
      service.addNewWorkout({ id: i, name: `Workout ${i}`, workouts: [{ type: 'Running', minutes: 45 }] });
    }

    const result = service.filterWorkouts('Running', null, 4);
    expect(result?.length).toBe(4);
    expect(result[3].name).toBe('Workout 20');

  })


});
