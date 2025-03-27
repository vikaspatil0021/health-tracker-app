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

export type SelectOptions = {
    name: "Cycling" | "Running" | "Swimming" | "Yoga";
    code: "Cycling" | "Running" | "Swimming" | "Yoga";
}

export type SelectionFilterOptions = {
    name: "Cycling" | "Running" | "Swimming" | "Yoga" | "All";
    code: "Cycling" | "Running" | "Swimming" | "Yoga" | "All";
};