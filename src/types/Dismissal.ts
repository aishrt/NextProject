export type Dismissal = {
  situation: string;

  dateOfBirth: string;
  age: number;
  salary: number;
  employment: string;
  service: string;
  serviceYears: number;
  startPosition: string;

  department: string;
  industry: string;
  employees: string;

  notificationDate: string;
  dismissalReason: string;
  warning: string;
  meetings: string;

  constructiveDate: string;
  constructiveReason: [string];
  otherConstructive: string;

  circumstances: string;
  evidence: string;
  documents: [string];

  witness: string;
  misconduct: string;
  misconducts: [string];
  otherConduct:string;

  progress: number;
  nextProgress: number;
  checked: boolean;

  user: string;
  caseId: string;
};
