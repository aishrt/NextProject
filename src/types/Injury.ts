export type Injury = {
  age: string;
  gender: string;
  current_age: number;
  occupation: string;
  faultPercent: string;
  others: string;
  occupationAfter: string;
  stabilized: string;
  relationship: string;
  otherRelationship: string;
  economicLevel: string;
  live: string;
  dependentChildren: number;
  protection: string;
  otherProtection: string;
  protectionRelation: string;
  otherProtectionRelation: string;

  accident_place: string;
  abroad: string;
  situation: string;
  accident_type: string;
  nature: string;
  other_nature: string;
  statusAcc: string;
  dependent: string;
  legal: string;
  isAlcoholInfluence: string;
  faultPercentage: string;
  otherFault: number;
  currentCondition: string;
  otherCondition: string;
  deceased: string;
  otherDeceased: string;

  injuryType: string;
  allInjury: [string];
  otherInjury: string;
  isMedicalExamined: string;
  deficitRate: string;
  psychological: string;
  personalized: string;
  dfp: number;
  daysPercentage: string;
  daysNumber: string;
  dftPercentage: string;
  dftdays: string;
  points: string;
  temporaryPoints: string;
  permanentPoints: string;

  injuryEffectCarrier: string;
  losses: number;
  prof_dfp: number;
  totalAmt: number;
  participation: string;
  evidence: string;
  compensation: number;
  severity_points: number;
  wanted_compensation: number;
  activity: number;
  isInjuryImpact: string;
  sexualHarm: string;
  injuryCause: [string];
  fairAmt: number;
  establishmentLoss: number;
  compAmount: number;
  protectionMeasure: string;

  hours: number;
  salary: number;
  netSalary: number;
  capitalizationTable: string;
  tableUsed: string;
  years: string;
  otherCapitalization: string;
  compensationDuration: string;
  victims: string;
  claimProposal: string;
  workAbility: string;
  financialLosses: number;

  indirectVictim: number;
  isVictimLive: string;
  insurance: string;
  duration: number;
  caregiving: CareData[];
  victimDetails: Victim[];

  damagesCategory: Proposed[];

  progress: number;
  nextProgress: number;
  checked: boolean;

  user: string;
  caseId: string;
};
type CareData = {
  name: string;
  duration: string;
};
type Victim = {
  name: string;
  surname: string;
  relation: string;
  otherRelation: string;
  damage: string;
};

type Proposed = {
  name: string;
  amount: string;
};
