export type SleepStage = 'awake' | 'light' | 'deep' | 'rem' | 'unknown';

export interface SleepStageRecord {
    stage: SleepStage;
    start: Date;
    end?: Date;
    durationSeconds?: number;
}

export interface SleepRecord {
    start: Date;
    end?: Date;
    durationSeconds?: number;
    stages?: SleepStageRecord[];
}

export interface SleepProvider {
    getSleepBetween(params: { from: Date; to: Date }): Promise<SleepRecord[]>;
}
