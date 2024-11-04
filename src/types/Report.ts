export type Report = {
  _id: string;
  questions: object;
  case_id: string;
  user_id: string;
  winning_percentage: number;
  court_amount: number;
  percentage_change: number;
  description: string;
  paymentId: string;
  isPurchased: boolean;
  status: string;
};
