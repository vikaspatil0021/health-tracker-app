type Workouts = {
    type: "Cycling" | "Running" | "Swimming" | "Yoga",
    minutes: number
}

export type WorkoutDataModal = {
    id?: number,
    name: string,
    workouts: Workouts[]
}