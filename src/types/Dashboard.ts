import { Cases, CaseApiResponse } from "./Cases";

export type DashboardData = {
  totalUser: number;
  caseManagers: number;
  totalLawyers:number;
  activeCases: number;
  inProgress: number;
  preLitigation: number;
  litigation: number;
  activePreLitigation: number;
  activeLitigation: number;
  resolved: number;
  notResolved: number;
  submitted: number;
  litigationLawyer: number;
  preLitigationLawyer: number;
  activeCase: {
    _id: string;
    referenceId: number;
    isEvalReport: boolean;
    isFinancialReport: boolean;
    prepareGraph: boolean;
    lawyerFinancialReport: boolean;
    requestStatus: string;
    category: string;
    personalInfo: [];
    user: { firstName: string; lastName: string };
    expert: string;
    progress: number;
    nextProgress: number;
    isAccepted: boolean;
    isLaywerAssigned: boolean;
    status: string;
    evalReportStatus: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  courtHearing: CourtHearing;
  evalReports: EvalReport[];
  documents: Documents[];
  statusType: [number];
  litigationType: [number];
  preLitigationType: [number];
  caseProgress: Cases[];
};

export type CourtHearing = {
  _id: string;
  case_id: Cases;
  title: string;
  address: string;
  description: string;
  objective: string;
  userId: string;
  addedBy: string;
  date: string;
  time: string;
  reminderDate: string;
  reminderTitle: string;
  reminderDescription: string;
  reminderTime: string;
  reminder: string;
  document: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type EvalReport = {
  _id: string;
  questions: [
    {
      answer: string;
      _id: string;
      question: string;
      limit: number;
    },
    {
      answer: string;
      _id: string;
      question: string;
      limit: number;
      isLock: boolean;
    }
  ];
  case_id: Cases;
  user_id: string;
  winning_percentage: number;
  description: string;
  isPurchased: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type Documents = {
  uploadedBy: {
    user: string;
    role: string;
  };
  _id: string;
  case_id: Cases;
  task_id: null;
  document: string;
  role: string;
  status: string;
  title: string;
  category: string;
  description: string;
  version: number;
  previousVersions: [
    {
      version: 0;
      document: string;
      updatedAt: string;
      _id: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
  __v: 0;
};
