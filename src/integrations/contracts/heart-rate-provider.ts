export type HeartRateRecord = {
    start: Date;
    end: Date;
    bpm: number;
};

export interface HeartRateProvider {
    getHeartRateBetween(params: { from: Date; to: Date }): Promise<HeartRateRecord[]>;
}
