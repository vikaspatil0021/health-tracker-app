type Workouts = {
    type: string,
    minutes: number
}

export type WorkoutData = {
    id?: number,
    name: string,
    workouts: Workouts[]
}