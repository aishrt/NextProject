export type Sudden = {
  work: string;
  duration: number;
  relationTerminated: [string];
  otherTerminated: string;
  contract: [string];
  noticePeriod: string;
  noticeDuration: number;
  factors: [string];

  // typeOfContract: string;
  // specificDetail: string;

  //noticeMonths: string;
  monthsNumber: number;
  financial: Financial[];
  financialDamage: string;
  currentSituation: string;
  otherSituation: string;

  // totalvalue: string;
  // amount: number;
  // financialInvestments: string;
  // describeFinancial: string;
  // totalRevenue: string;
  // totalRevenueAmount: number;
  // grossMargin: string;
  // grossMarginAmount: number;
  // businessRely: string;
  // officialDocuments: string;

  industry: string;
  otherIndustry: string;
  marketCondition: string;
  collective: string;
  proceedings: string;
  courtType: string;
  courtName: string;
  courtLocation: string;
  // newPartner: string;
  // openCollective: string;

  notice: number;
  somethingWrong: string;
  whatDidWrong: [string];
  otherReason: string;
  issuesInvolve: string;
  contractBroke: string;
  endingIssue: string;
  obligations: string;
  accused: string;
  breachCited: string;

  progress: number;
  nextProgress: number;
  checked: boolean;

  user: string;
  caseId: string;
};
type Financial = {
  name: string;
  amount: string;
};
