export type Notification = {
  data: Data[];
  totalPages: number;
};

export type Data = {
  isRead: boolean;
  _id: string;
  title: string;
  description: string;
  type: string;
  caseId: object;
  role: string;
  addedBy: string;
  listenTo: string;
  createdAt: string;
  updatedAt: string;
};

