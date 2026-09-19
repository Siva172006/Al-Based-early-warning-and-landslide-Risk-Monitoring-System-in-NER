export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type StateNER =
  | 'Assam'
  | 'Meghalaya'
  | 'Arunachal Pradesh'
  | 'Sikkim'
  | 'Nagaland'
  | 'Manipur'
  | 'Mizoram'
  | 'Tripura';

export type LanguageCode = 'en' | 'hi' | 'as' | 'bn';

export interface LandslideZone {
  id: string;
  name: string;
  district: string;
  state: StateNER;
  lat: number;
  lng: number;
  radiusKm: number;
  polygon: [number, number][]; // Coordinates for GIS polygon boundary
  currentRisk: RiskLevel;
  probability: number; // 0 - 100%
  riskScore: number; // 0 - 100
  rainfall24h: number; // mm
  rainfall7d: number; // mm
  rainfallAnomaly: number; // % above normal
  soilMoisture: number; // % saturation
  slopeAngle: number; // degrees (e.g., 38 deg)
  elevation: number; // meters above sea level
  aspect: string; // e.g. North-West
  drainageDensity: 'LOW' | 'MEDIUM' | 'HIGH';
  landUse: string; // e.g. Steep Cut Slope, Tea Plantation, Secondary Forest
  terrainType?: string;
  evacuationRoute?: string;
  populationAtRisk: number;
  criticalInfraCount: number;
  roadConnectivityIndex: 'ESSENTIAL_SINGLE_ACCESS' | 'ALTERNATIVE_AVAILABLE' | 'URBAN_NETWORK';
  shortTermForecast: {
    next6hRisk: RiskLevel;
    next24hRisk: RiskLevel;
    next48hRisk: RiskLevel;
    predictedRainfall24h: number;
  };
}

export type SensorType = 'SOIL_MOISTURE' | 'TILTMETER' | 'PIEZOMETER' | 'RAIN_GAUGE' | 'CRACK_METER';
export type SensorStatus = 'NORMAL' | 'WARNING' | 'ALERT' | 'OFFLINE';

export interface IoTSensor {
  id: string;
  code: string;
  name: string;
  zoneId: string;
  type: SensorType;
  lat: number;
  lng: number;
  value: number;
  unit: string;
  status: SensorStatus;
  batteryPercent: number;
  lastUpdated: string;
  trend: 'RISING' | 'STABLE' | 'FALLING';
}

export interface RoadSector {
  id: string;
  code: string;
  name: string;
  state: StateNER;
  coords: [number, number][];
  status: 'CLEAR' | 'PARTIALLY_BLOCKED' | 'CRITICALLY_BLOCKED';
  cause?: string;
  clearingProgress?: number; // 0 - 100%
  detourRoute?: string;
  connectedZoneId?: string;
}

export interface CriticalInfra {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'SCHOOL' | 'BRIDGE' | 'SHELTER' | 'EOC_HQ';
  lat: number;
  lng: number;
  district: string;
  state: StateNER;
  status: 'OPERATIONAL' | 'ON_STANDBY' | 'THREATENED';
}

export interface HistoricalLandslide {
  id: string;
  title: string;
  date: string;
  district: string;
  state: StateNER;
  lat: number;
  lng: number;
  severity: 'MODERATE' | 'SEVERE' | 'CATASTROPHIC';
  casualties: number;
  affectedPeople: number;
  triggerRainfall24h: number; // mm
  roadBlockedDays: number;
  geologicalFailureType: string;
}

export type ReportStatus = 'PENDING_AI_VERIFY' | 'FIELD_VERIFYING' | 'PENDING_VERIFICATION' | 'CONFIRMED' | 'REJECTED';
export type ReportType = 'CRACK' | 'GROUND_CRACK' | 'ROCKFALL' | 'SLOPE_MOVEMENT' | 'MUD_FLOW' | 'ROAD_BLOCKAGE' | 'WATERLOGGING';

export interface CitizenReport {
  id: string;
  timestamp: string;
  reporterName: string;
  reporterPhone?: string;
  contactPhone?: string;
  reporterRole?: 'CITIZEN' | 'FIELD_OFFICER';
  lat: number;
  lng: number;
  locationName: string;
  district?: string;
  state?: StateNER;
  reportType: ReportType;
  severity?: RiskLevel;
  description: string;
  imageUrl?: string;
  photoUrl?: string;
  status: ReportStatus;
  aiRiskLevel?: RiskLevel;
  aiConfidence?: number;
  aiFindings?: string[];
  fieldOfficerNotes?: string;
  verifiedBy?: string;
  isOfflineQueued?: boolean;
}

export interface EarlyWarningAlert {
  id: string;
  timestamp: string;
  zoneId: string;
  zoneName: string;
  district: string;
  state: StateNER;
  riskLevel: RiskLevel;
  triggerReason: string;
  recommendedAction: string;
  affectedRoads: string[];
  affectedVillages: string[];
  emergencyHotlines: string[];
  broadcastChannels: ('SMS' | 'APP_PUSH' | 'WEB_SIREN' | 'DISTRICT_RADIO')[];
  status: 'ACTIVE' | 'RESOLVED';
}

export interface EmergencyPriorityItem {
  zoneId: string;
  zoneName: string;
  district: string;
  state: StateNER;
  compositeScore: number; // 0 to 100
  riskContribution: number;
  populationContribution: number;
  infrastructureContribution: number;
  isolationContribution: number;
  severityContribution: number;
  actionRequired: string;
  recommendedUnits: string[];
}
