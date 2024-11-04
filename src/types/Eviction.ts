export type Eviction = {
  leaseInitialDate: string;
  leaseInitialYear: string;
  annualRent: string;
  premises: string;

  // --------------------
  activityType: string;
  activitySector: string;

  leaseRenewal: number;
  terminationDate: string;
  effectiveTerminationDate: string;
  terminationReason: string;
  explainReason: string;
  nonRenewalEffect: string;
  describeNonRenewal: string;
  sublet: string;
  subletArea: number;

  premisesNature: string;
  premisesArea: number;
  groundSurface: number;
  weightedArea: number;
  premisesLocated: string;
  otherLotsNature: string;
  premisesAccess: string;

  buildingType: string;
  buildingAge: string;
  buildingFloor: number;

  citySize: string;
  location: string;
  citySituation: string;
  transportConnectivity: string;
  pointOfInterest: string;
  reputedBrand: string;
  competingBrand: string;
  miscellaneousAdvantages: string;

  rentalValue: number;
  leaseRental: number;

  collectiveProcedures: string;

  reputation: string;
  employeesNumber: number;
  operationPeriod: string;
  weeklyOpening: string;
  profitability: string;
  clientTraffic: string;
  inventoryNature: string;
  inventoryValue: number;
  businessStrength: string;
  businessWeakness: string;
  describeStrength: string;
  describeWeakness: string;
  businessRetain: string;

  businessMethod: string;
  activities: number;
  annualRevenue: number;
  revenueTaxes: string;

  lessorPercentage: number;
  selfPercentage: number;
  expertPercentage: number;
  dailyReceipts: number;

  businessMargin: number;
  lessorMargin: number;
  proposeMargin: number;
  expertMargin: number;

  annualEBE: number;
  lessorEBE: number;
  proposeEBE: number;
  expertEBE: number;

  // --------------------

  // useClause: string;
  // surfaceType: string;
  // // --------------------
  // leaseEndDate: string;
  // leaseEndReason: string;
  // subleasing: string;
  // leaseManagement: string;
  // premisesType: string;
  // other: string;
  // surfaceArea: string;
  // primaryUse: string;
  // customerAccess: string;
  // facadeFrontage: string;
  // premisesState: string;
  // financialSituation: string;
  // notoriety: string;
  // leasePeriod: string;
  // openingHours: string;
  // leaseRenewalNumber: string;
  // premisesActivity: string;
  // describeActivity: string;
  // spacePercent: string;
  // describeAdvantages: string;
  // receptionNature: string;

  // retention: string;
  // leaseActivities: string;
  // annualRevenue: string;
  // existenceProcedure: string;

  progress: number;
  nextProgress: number;
  checked: boolean;

  user: string;
  caseId: string;
};
