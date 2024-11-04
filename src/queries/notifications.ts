import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/utils/axios";
import { useSession } from "next-auth/react";
import { User } from "@/types/User";

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

export const getAllNotifications = async (
  page: number,
  session?: { role: string; _id: string },
  caseId?: string
): Promise<Notification | undefined> => {
  if (session?.role == "client" || session?.role == "lawyer") {
    let url = `/api/notifications/list?user_id=${session?._id}&role=${session?.role}&caseId=${caseId}`;
    return axios.get(`${url}&page=${page ?? 1}`);
  }
  if (session?.role == "expert" || session?.role == "admin") {
    let url = `/api/notifications/list?role=${session?.role}&caseId=${caseId}`;
    return axios.get(`${url}&page=${page ?? 1}`);
  }
};

type QueryFnType = typeof getAllNotifications;

type useNotificationData = {
  config?: QueryConfig<QueryFnType>;
  page: number;
  caseId?: string;
};

export const useNotifications = (
  { config, page, caseId }: useNotificationData = { page: 1, caseId: "" }
) => {
  const { data } = useSession();
  const session: any = data?.user;
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["Notifications"],
    queryFn: () => getAllNotifications(page, session, caseId),
  });
};
