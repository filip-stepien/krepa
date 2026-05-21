export type StepsRecord = {
    start: Date;
    end: Date;
    stepsCount: number;
};

export interface StepsProvider {
    getStepsBetween(params: { from: Date; to: Date }): Promise<StepsRecord[]>;
}
