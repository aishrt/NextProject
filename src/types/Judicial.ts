import dayjs, { Dayjs } from "dayjs";

export type Judicial = {
  contractDate: string;
  contractDuration: number;
  initialRent: number;
  lastRent: number;
  silentRenewal: string;
  renewalNumber: number;
  renewalDate: Dayjs;
  lastRentNature: string;

  businessActivity: string;
  specificActivity: string;
  exclusiveClause: string;
  favorableClause: [string];

  primaryNature: string;
  otherNature: string;
  typeOfSurface: string;
  otherSurface: string;
  mainArea: number;
  floorArea: number;
  weightedArea: number;
  floorsOccupied: string;
  buildingNature: string;
  otherBuilding: string;
  accessibility: string;
  facade: string;
  currentState: string;
  specificEquipment: string;

  buildingType: string;
  otherType: string;
  buildingAge: string;
  floorNumber: number;

  townSize: string;
  premisesLocation: string;
  premisesSituation: string;
  pedestrianZone: string;
  transportLinks: string;
  parkingSituation: string;
  spacesNumber: number;
  interest: string;
  quality: string;
  reputedBrands: string;
  competingBrands: string;
  advantages: string;
  otherAdvantages: string;

  rental: number;
  premises: premisesData[];

  reasonsForRent: [string];
  favorableFactors: [string];
  unfavorableFactors: [string];
  notableDate: string;

  progress: number;
  nextProgress: number;

  checked: boolean;
  user: string;
  caseId: string;
};

type premisesData = {
  similarityActivity: string;
  premisesQuality: string;
  valuationSource: string;
  weightedArea: number;
  price: number;
};
