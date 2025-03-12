export type Workout = {
    type: "Cycling" | "Running" | "Swimming" | "Yoga",
    minutes: number
}

export type WorkoutDataModal = {
    id?: number,
    name: string,
    workouts: Workout[]
}

export type StorageData = {
    currentId: number,
    workoutData: WorkoutDataModal[]
}

export interface SelectOptions {
    name: string;
    code: "Cycling" | "Running" | "Swimming" | "Yoga";
}