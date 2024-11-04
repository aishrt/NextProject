export type Child = {
  role: string;

  monthlyIncome: number;
  monthlyExpenses: number;
  children: number;

  otherMonthlyIncome: number;
  otherMonthlyExpenses: number;
  otherChildren: number;

  proposedAmount: number;
  parentProposedAmount: number;
  payingAmount: number;

  educational: number;
  describe: string;

  checked: boolean;
  spousalSupport: string;

  progress: number;
  nextProgress: number;
  user: string;
  caseId: string;
};
