import { LandslideZone, EmergencyPriorityItem, RiskLevel } from '../types';

/**
 * Calculates landslide failure probability and risk score
 * based on multi-parameter environmental and geotechnical inputs:
 * Rainfall (24h + 7d) + Soil Moisture + Slope Angle + Drainage + Historical Susceptibility
 */
export function calculateLandslideRiskScore(params: {
  rainfall24h: number;
  rainfall7d: number;
  rainfallAnomaly: number;
  soilMoisture: number;
  slopeAngle: number;
  drainageDensity: 'LOW' | 'MEDIUM' | 'HIGH';
}): { probability: number; riskScore: number; riskLevel: RiskLevel } {
  // 1. Rainfall Index (0-100)
  // 24h rainfall > 150mm is critical in NER; 7d > 400mm saturates Himalayan colluvium
  const rf24Score = Math.min(100, (params.rainfall24h / 180) * 100);
  const rf7dScore = Math.min(100, (params.rainfall7d / 450) * 100);
  const anomalyScore = Math.min(100, Math.max(0, (params.rainfallAnomaly + 20) / 1.5));
  const rainfallIndex = rf24Score * 0.5 + rf7dScore * 0.35 + anomalyScore * 0.15;

  // 2. Soil Moisture Index (0-100)
  // Over 80% volumetric moisture creates positive pore water pressure
  const moistureScore = params.soilMoisture > 80
    ? 80 + (params.soilMoisture - 80) * 2
    : (params.soilMoisture / 80) * 75;
  const soilIndex = Math.min(100, Math.max(0, moistureScore));

  // 3. Slope Steepness Factor (0-100)
  // Angles > 35° are highly prone to debris flow and shear failure
  let slopeFactor = 20;
  if (params.slopeAngle > 45) {
    slopeFactor = 95;
  } else if (params.slopeAngle > 35) {
    slopeFactor = 70 + (params.slopeAngle - 35) * 2.5;
  } else if (params.slopeAngle > 25) {
    slopeFactor = 40 + (params.slopeAngle - 25) * 3;
  } else {
    slopeFactor = (params.slopeAngle / 25) * 35;
  }

  // 4. Drainage Index
  const drainageMap = { LOW: 40, MEDIUM: 65, HIGH: 90 };
  const drainageIndex = drainageMap[params.drainageDensity];

  // Composite ML Weighted Hazard Score (Simulating XGBoost / Random Forest ensemble weights)
  const compositeRiskScore = Math.round(
    rainfallIndex * 0.38 +
    soilIndex * 0.32 +
    slopeFactor * 0.20 +
    drainageIndex * 0.10
  );

  // Probability calibrated with sigmoid transition
  const normalizedZ = (compositeRiskScore - 60) / 15;
  const probability = Math.round(100 / (1 + Math.exp(-normalizedZ)));

  let riskLevel: RiskLevel = 'LOW';
  if (compositeRiskScore >= 80 || probability >= 80) {
    riskLevel = 'CRITICAL';
  } else if (compositeRiskScore >= 65 || probability >= 65) {
    riskLevel = 'HIGH';
  } else if (compositeRiskScore >= 45 || probability >= 45) {
    riskLevel = 'MODERATE';
  } else {
    riskLevel = 'LOW';
  }

  return {
    riskScore: Math.min(100, Math.max(0, compositeRiskScore)),
    probability: Math.min(100, Math.max(0, probability)),
    riskLevel,
  };
}

/**
 * Emergency Prioritization Algorithm
 * Automatically identifies locations requiring immediate attention based on:
 * Priority = (Risk Level * 0.30) + (Population Exposure * 0.25) +
 *            (Infrastructure Importance * 0.20) + (Road Connectivity * 0.15) + (Incident Severity * 0.10)
 */
export function computeEmergencyPriorities(
  zones: LandslideZone[],
  blockedRoadZones: Set<string>
): EmergencyPriorityItem[] {
  return zones
    .map((zone) => {
      // 1. Risk Contribution (0-30)
      const riskMap: Record<RiskLevel, number> = {
        CRITICAL: 30,
        HIGH: 22,
        MODERATE: 12,
        LOW: 4,
      };
      const riskContribution = (riskMap[zone.currentRisk] / 30) * 30 * (zone.riskScore / 100);

      // 2. Population Exposure (0-25)
      // Normalized: > 25,000 people = max 25 pts
      const populationContribution = Math.min(25, (zone.populationAtRisk / 30000) * 25);

      // 3. Infrastructure Importance (0-20)
      // Normalized: > 6 critical hospitals/bridges/power = max 20 pts
      const infrastructureContribution = Math.min(20, (zone.criticalInfraCount / 8) * 20);

      // 4. Road Connectivity Impact (0-15)
      // Single lifeline corridor blocked produces highest vulnerability to valley isolation
      let roadWeight = 5;
      if (zone.roadConnectivityIndex === 'ESSENTIAL_SINGLE_ACCESS') roadWeight = 15;
      else if (zone.roadConnectivityIndex === 'ALTERNATIVE_AVAILABLE') roadWeight = 9;
      else roadWeight = 4;
      if (blockedRoadZones.has(zone.id)) {
        roadWeight = Math.min(15, roadWeight * 1.3);
      }
      const isolationContribution = roadWeight;

      // 5. Incident Severity Contribution (0-10)
      const severityContribution = zone.currentRisk === 'CRITICAL' ? 10 : zone.currentRisk === 'HIGH' ? 7 : 3;

      const compositeScore = Math.round(
        riskContribution +
        populationContribution +
        infrastructureContribution +
        isolationContribution +
        severityContribution
      );

      let actionRequired = 'Continue standard sensor polling and situational telemetry monitoring.';
      const recommendedUnits: string[] = [];

      if (compositeScore >= 75) {
        actionRequired = 'PRIORITY 1: Pre-position SDRF tactical evacuation boats/trucks, mobilise BRO bulldozers, and issue siren alarms.';
        recommendedUnits.push('1st Bn NDRF Guwahati Tactical Wing', 'SDRF Quick Response Squad', 'Border Roads Task Force (BRTF)', 'District Health Trauma Ambulance');
      } else if (compositeScore >= 60) {
        actionRequired = 'PRIORITY 2: Restrict single-lane arterial vehicular movements. Alert primary health centers and relief camp coordinators.';
        recommendedUnits.push('State Disaster Response Patrol', 'Traffic Police Highway Escort', 'Public Works Dept. (PWD) Road Clearer');
      } else if (compositeScore >= 40) {
        actionRequired = 'PRIORITY 3: Increase IoT sensor logging frequency to 60 seconds; notify village disaster management committees (VDMC).';
        recommendedUnits.push('Local Civil Defence Volunteers', 'Gram Panchayat Relief Warden');
      } else {
        recommendedUnits.push('Routine Regional Observation Post');
      }

      return {
        zoneId: zone.id,
        zoneName: zone.name,
        district: zone.district,
        state: zone.state,
        compositeScore: Math.min(100, Math.max(0, compositeScore)),
        riskContribution: Math.round(riskContribution),
        populationContribution: Math.round(populationContribution),
        infrastructureContribution: Math.round(infrastructureContribution),
        isolationContribution: Math.round(isolationContribution),
        severityContribution: Math.round(severityContribution),
        actionRequired,
        recommendedUnits,
      };
    })
    .sort((a, b) => b.compositeScore - a.compositeScore);
}
