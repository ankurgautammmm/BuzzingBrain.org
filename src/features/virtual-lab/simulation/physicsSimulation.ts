/**
 * Physics Ohm's Law Simulation Engine
 * Computes deterministic electrical circuit variables:
 * V = I * R, total resistance, Joule power heating, meter deflections, and V-I linear regression.
 */

export interface CircuitParameters {
  supplyVoltageVolts: number; // 0 to 12 V
  wireNominalResistanceOhms: number; // e.g. 2.50 Ω
  wireLengthCm: number; // e.g. 100 cm
  rheostatResistanceOhms: number; // 0 to 20 Ω
  isSwitchClosed: boolean;
  wireTemperatureCelsius: number; // baseline 25°C
}

export interface CircuitState {
  currentAmperes: number;
  measuredVoltageDropVolts: number;
  circuitPowerWatts: number;
  actualWireResistanceOhms: number;
  resistancePerUnitLengthOhmsPerMeter: number;
  ammeterAngleDegrees: number; // 0 to 80 degrees deflection
  voltmeterAngleDegrees: number; // 0 to 80 degrees deflection
  statusMessage: string;
}

export function computeOhmicCircuit(params: CircuitParameters): CircuitState {
  const { supplyVoltageVolts, wireNominalResistanceOhms, wireLengthCm, rheostatResistanceOhms, isSwitchClosed, wireTemperatureCelsius } = params;

  if (!isSwitchClosed || supplyVoltageVolts <= 0) {
    return {
      currentAmperes: 0,
      measuredVoltageDropVolts: 0,
      circuitPowerWatts: 0,
      actualWireResistanceOhms: wireNominalResistanceOhms,
      resistancePerUnitLengthOhmsPerMeter: Number((wireNominalResistanceOhms / (wireLengthCm / 100)).toFixed(3)),
      ammeterAngleDegrees: 0,
      voltmeterAngleDegrees: 0,
      statusMessage: 'Circuit open. Switch is disconnected; zero current flow.'
    };
  }

  // Temperature coefficient of Nichrome α ≈ 0.0004 / °C
  const deltaT = Math.max(0, wireTemperatureCelsius - 25);
  const alpha = 0.0004;
  const actualWireR = wireNominalResistanceOhms * (1 + alpha * deltaT);

  // Meter internal resistances:
  // Ammeter shunt R_A ≈ 0.05 Ω
  // Voltmeter internal resistance R_V ≈ 10,000 Ω (negligible branch current)
  // Internal battery resistance r ≈ 0.15 Ω
  const rInternal = 0.15;
  const rAmmeter = 0.05;
  const totalR = actualWireR + rheostatResistanceOhms + rInternal + rAmmeter;

  const current = supplyVoltageVolts / totalR;
  const measuredVoltage = current * actualWireR;
  const power = measuredVoltage * current;

  const wireLengthM = wireLengthCm / 100;
  const resistancePerMeter = actualWireR / wireLengthM;

  // Max scale: Ammeter 0-1.5 A (80° max deflection)
  const ammeterAngle = Math.min(80, (current / 1.5) * 80);

  // Max scale: Voltmeter 0-3.0 V (80° max deflection)
  const voltmeterAngle = Math.min(80, (measuredVoltage / 3.0) * 80);

  let status = `Circuit active. Current I = ${current.toFixed(3)} A, Voltage V = ${measuredVoltage.toFixed(3)} V.`;
  if (power > 5.0) {
    status += ' [Warning: High current Joule heating active!]';
  }

  return {
    currentAmperes: Number(current.toFixed(3)),
    measuredVoltageDropVolts: Number(measuredVoltage.toFixed(3)),
    circuitPowerWatts: Number(power.toFixed(3)),
    actualWireResistanceOhms: Number(actualWireR.toFixed(3)),
    resistancePerUnitLengthOhmsPerMeter: Number(resistancePerMeter.toFixed(3)),
    ammeterAngleDegrees: Number(ammeterAngle.toFixed(1)),
    voltmeterAngleDegrees: Number(voltmeterAngle.toFixed(1)),
    statusMessage: status
  };
}

/**
 * Calculates linear regression slope (Resistance) from an array of recorded (V, I) data points.
 */
export function calculateLinearRegressionResistance(points: { current: number; voltage: number }[]): {
  slopeR: number;
  intercept: number;
  rSquared: number;
} {
  if (!points || points.length < 2) {
    return { slopeR: 0, intercept: 0, rSquared: 0 };
  }

  const n = points.length;
  let sumI = 0;
  let sumV = 0;
  let sumIV = 0;
  let sumI2 = 0;
  let sumV2 = 0;

  for (const pt of points) {
    sumI += pt.current;
    sumV += pt.voltage;
    sumIV += pt.current * pt.voltage;
    sumI2 += pt.current * pt.current;
    sumV2 += pt.voltage * pt.voltage;
  }

  const denominator = (n * sumI2 - sumI * sumI);
  if (Math.abs(denominator) < 1e-9) {
    return { slopeR: 0, intercept: 0, rSquared: 0 };
  }

  const slope = (n * sumIV - sumI * sumV) / denominator;
  const intercept = (sumV - slope * sumI) / n;

  // Pearson correlation coefficient r
  const numR = (n * sumIV - sumI * sumV);
  const denR = Math.sqrt((n * sumI2 - sumI * sumI) * (n * sumV2 - sumV * sumV));
  const rSquared = denR > 0 ? Math.pow(numR / denR, 2) : 0;

  return {
    slopeR: Number(slope.toFixed(3)),
    intercept: Number(intercept.toFixed(3)),
    rSquared: Number(rSquared.toFixed(4))
  };
}
