import { Cases } from "./Cases";
import { LawyerType } from "./LawyerTypes";

export type RequestType = {
  _id: string;
  caseId: Cases;
  lawyer: LawyerType;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  counterAmount?: number;
};
