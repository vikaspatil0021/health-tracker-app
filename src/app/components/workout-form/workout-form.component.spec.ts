import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutFormComponent } from './workout-form.component';
import { WorkoutService } from '../../services/workout.service';
import { of } from 'rxjs';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let mockWorkoutService: jasmine.SpyObj<WorkoutService>;


  beforeEach(async () => {
    mockWorkoutService = jasmine.createSpyObj('WorkoutService', ['addNewWorkout']);

    await TestBed.configureTestingModule({
      imports: [WorkoutFormComponent],
      providers: [{ provide: WorkoutService, useValue: mockWorkoutService }]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //  Test - handle_add_workout_type function 
  it('should add a workout type and reset fields', () => {
    component.formGroup.setValue({
      user_name: 'John',
      selected_workout_type: { code: 'Running', label: 'Running' },
      minutes: 30
    });

    component.handle_add_workout_type();

    expect(component.workoutTypes.length).toBe(1);
    expect(component.workoutTypes[0]).toEqual({ type: 'Running', minutes: 30 });

    expect(component.formGroup.get('selected_workout_type')?.value).toBeNull();
    expect(component.formGroup.get('minutes')?.value).toBeNull();
  });

  it("should disable inputs after 4 workout types", () => {
    component.workoutTypes = [
      { type: 'Running', minutes: 30 },
      { type: 'Running', minutes: 30 },
      { type: 'Running', minutes: 30 }
    ]

    component.formGroup.setValue({
      user_name: 'John',
      selected_workout_type: { code: 'yoga', label: 'Yoga' },
      minutes: 40
    });

    component.handle_add_workout_type();

    expect(component.workoutTypes.length).toBe(4);
    expect(component.formGroup.controls['selected_workout_type'].disabled).toBeTrue();
    expect(component.formGroup.controls['minutes'].disabled).toBeTrue();
  });

  //  Test - handle_remove_workout_type function 
  it("should remove specific workout type based on index for now", () => {
    component.workoutTypes = [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 10 },
      { type: 'Running', minutes: 30 }
    ];

    component.handle_remove_workout_type(1);

    expect(component.workoutTypes.length).toBe(2);
    expect(component.workoutTypes[1]).toEqual({ type: 'Running', minutes: 30 })
  })

  it("should enable the inputs if workouttype is less than 4", () => {
    component.workoutTypes = [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 10 },
      { type: 'Swimming', minutes: 20 },
      { type: 'Yoga', minutes: 40 }
    ];

    component.formGroup.controls['selected_workout_type'].disable();
    component.formGroup.controls['minutes'].disable();

    component.handle_remove_workout_type(1);

    expect(component.formGroup.controls['selected_workout_type'].disabled).toBeFalse();
    expect(component.formGroup.controls['minutes'].disabled).toBeFalse();
  })

  //  Test - handle_add_new_workout_data function 
  it('should call addNewWorkout when user_name and workoutTypes are valid', () => {

    component.workoutTypes = [{ type: 'Cycling', minutes: 30 }];
    component.formGroup.setValue({
      user_name: 'John Doe',
      selected_workout_type: null,
      minutes: null
    });

    component.handle_add_new_workout_data();

    expect(mockWorkoutService.addNewWorkout).toHaveBeenCalledWith({
      name: 'John Doe',
      workouts: [{ type: 'Cycling', minutes: 30 }]
    });

    expect(component.workoutTypes.length).toBe(0);
    expect(component.formGroup.get('user_name')?.value).toBeNull();

    expect(component.formGroup.controls['selected_workout_type'].enabled).toBeTrue();
    expect(component.formGroup.controls['minutes'].enabled).toBeTrue();
  });
});
