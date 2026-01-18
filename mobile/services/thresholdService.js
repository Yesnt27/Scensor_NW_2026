class ThresholdService {
    constructor() {
        this.readings = [];
        this.baselineAverage = null;
        this.baselineEstablished = false;
        this.readingCount = 20;
    }

    addReading(value) {
        this.readings.push({
            value,
            timestamp: Date.now(),
        });

        if (this.readings.length > this.readingCount) {
            this.readings.shift();
        }

        if (this.readings.length >= this.readingCount) {
            this.calculateBaseline();
        }
    }

    calculateBaseline() {
        const values = this.readings.map(r => r.value);
        const sum = values.reduce((acc, val) => acc + val, 0);
        this.baselineAverage = sum / values.length;
        this.baselineEstablished = true;
    }

    getBaseline() {
        return {
            average: this.baselineAverage,
            established: this.baselineEstablished,
            readingCount: this.readings.length,
        };
    }

    checkThreshold(currentValue) {
        if (!this.baselineEstablished) {
            return {
                isAlert: false,
                baseline: this.getBaseline(),
            };
        }

        const deviation = Math.abs(currentValue - this.baselineAverage);
        const percentDeviation = (deviation / this.baselineAverage) * 100;
        const isAlert = percentDeviation > 20;

        return {
            isAlert,
            baseline: this.getBaseline(),
            deviation: percentDeviation,
        };
    }

    reset() {
        this.readings = [];
        this.baselineAverage = null;
        this.baselineEstablished = false;
    }
}

export default new ThresholdService();

