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

  // Test missing or incomplete data
  it('should throw an error when adding a workout with incomplete data', () => {
    const props = {
      name: "Incomplete workout",
      workouts: []
    };

    expect(() => service.addNewWorkout(props)).toThrowError("Workout data is incomplete")
  });

  // Test max cap of 20 records
  it("should limit the number of stored workouts to 20", () => {

    for (let i = 4; i <= 20; i++) {
      service.addNewWorkout({ id: i, name: `Workout ${i}`, workouts: [{ type: 'Cycling', minutes: 45 }] });
    }

    expect(() => service.addNewWorkout({ id: 21, name: 'Overflow', workouts: [{ type: 'Cycling', minutes: 45 }] }))
      .toThrowError('Maximum of 20 records allowed.');
  });

  // Test addition of new workout data
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

  // Test get default workouts data
  it("should return first 3 workouts by default", () => {
   
    const data = service.getData();
    expect(data?.workoutData.length).toBe(3);
  })

  // Test get all workouts data based on page number
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

  
});
