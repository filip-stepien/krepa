export interface BloodOxygenRecord {
    start: Date;
    end?: Date;
    percentage: number;
}

export interface BloodOxygenProvider {
    getBloodOxygenBetween(params: { from: Date; to: Date }): Promise<BloodOxygenRecord[]>;
}
