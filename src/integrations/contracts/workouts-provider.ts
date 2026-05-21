export interface WorkoutRecord {
    title?: string;
    start: Date;
    end?: Date;
    durationSeconds?: number;
    caloriesKcal?: number;
}

export interface RunningWorkoutRecord extends WorkoutRecord {
    distanceMeters?: number;
    paceSecondsPerKm?: number;
    avgHeartRateBpm?: number;
    maxHeartRateBpm?: number;
    avgCadenceSpm?: number;
    maxCadenceSpm?: number;
    elevationGainMeters?: number;
}

export interface StrengthSetRecord {
    reps?: number;
    weightKg?: number;
    durationSeconds?: number;
    setType?: 'normal' | 'warmup' | 'drop' | 'failure';
    rpe?: number;
}

export interface StrengthExerciseRecord {
    name: string;
    sets: StrengthSetRecord[];
}

export interface StrengthWorkoutRecord extends WorkoutRecord {
    exercises: StrengthExerciseRecord[];
}

export interface WorkoutsProvider<T extends WorkoutRecord = WorkoutRecord> {
    getWorkoutsBetween(params: { from: Date; to: Date }): Promise<T[]>;
}
