export interface BodyWeightRecord {
    date: Date;
    weightKg: number;
}

export interface BodyWeightProvider {
    getBodyWeightBetween(params: { from: Date; to: Date }): Promise<BodyWeightRecord[]>;
}
