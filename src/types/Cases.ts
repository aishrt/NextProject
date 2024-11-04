export type Cases = {
  _id?: string;
  referenceId?: number;
  claimFor: string;
  isIndividual: string;
  isAuthorized: string;
  authoriseType: string;
  legalRepresentativeEmail: string;
  personEmail: string;
  personPhone: string;
  legalSupport: string;
  legalSupportName: string;
  legalSupportType: string;
  legalSupportContact: string;
  isWon:boolean;
  legalInsurance: string;
  role: string;
  isMinor: string;
  applyFor?: string;
  minorData: object;
  individualData: Individual;
  groupInfo: GroupInfo;
  companyData: Company;
  otherFinanced: object;
  personalInfo: [object];
  caseDetail: object;
  deadLine: object;
  opposingIndividual: Opposing;
  opposingCompany: OpposingCompany;
  opposing: string;
  user?: any;
  expert?: string;
  progress: number;
  uploadedBy: string;
  proceduralStatus: Procedural;
  category?: string;
  nextProgress: number;
  insuranceProvider: string;
  policyNumber: string;
  coverage: string;
  legalSupportEmail: string;
  otherLegalSupportType: string;
  position: string;
  caseType?: string;
  type?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  isEvalReport: boolean;
  lawyer: any;
  isFinancialReport: boolean;
  lawyerFinancialReport: boolean;
  requestStatus?:string;
  prepareGraph: boolean;
  doc_name: string;
  uploaded_by: string;
  description: string;
  isAccepted: boolean;
  isLaywerAssigned: boolean;
  title: string;
  reminder: string;
  __v?: boolean;
  documents: [Object];
  task: string;
};

type Individual = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  lat: number;
  doc_name: string;
  long: number;
};

type Company = {
  reg_no: string;
  companyName: string;
  legalRepresentative: string;
  address: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  position: string;
  authoriseType: string;
  legalRepresentativeEmail: string;
  isAuthorized: string;
  directDetails: {
    directPhone: string;
    directEmail: string;
  };
};

type GroupInfo = {
  first_name: string;
  last_name: string;
  doc_name: string;
  representative_email: string;
  representative_phone_no: string;
  isSpouse: string;
  isRepresentative: string;
  representativeLocation: string;
  personData: Person[];
  representativeCoord?: LocationLatLng;
  people: string;
  spouse_first_name: string;
};

type Person = {
  name?: string;
  surname?: string;
  dob?: string;
};

type Opposing = {
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  location: string;
  locationLatLng: LocationLatLng;
};
type OpposingCompany = {
  reg_no: string;
  companyName: string;
  address: string;
  legal: string;
  contact_name: string;
  phone_no: string;
  contact_email: string;
  directDetails: {
    directEmail: string;
    directContact: string;
  };
};

type Procedural = {
  reason: string;
  briefDescription: string;
  objectives: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  email: string;
  initialStatus: string;
  recievedResponse: string;
  takenResponse: string;
  otherAppeal: string;
  locationLatLong: LocationLatLng;
  notSatisfy?: string;
  satisfiedDecision?: string;
  primaryLegal?: string;
  doc_name: string;
  title: string;
  reminder: string;
};

type LocationLatLng = {
  lat: number;
  lng: number;
};
export type CaseApiResponse = {
  data: Cases[];
  page?: number;
  currentPage: number;
  totalEntries: number;
};
