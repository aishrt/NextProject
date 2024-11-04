import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/utils/axios";

const GetLawyerListQuery = ({
  page,
  search,
  isDeleted,
  isBlock,
}: {
  isBlock: any;
  isDeleted: any;
  search: any;
  page: string | undefined | number;
}): Promise<any> => {
  return axios.get(
    `/api/admin/lawyers/?page=${page ?? "1"}&search=${encodeURIComponent(
      search || ""
    )}&isDeletd=${isDeleted || false}&isBlock=${isBlock || false}`
  );
};

type QueryFnType = typeof GetLawyerListQuery;

type LawyerListPayload = {
  config?: QueryConfig<QueryFnType>;
  page?: string;
  search?: string | undefined | any;
  isDeleted?: boolean;
  isBlock?: boolean;
};

export const useLawyerListQuery = ({
  config,
  page,
  search,
  isBlock,
  isDeleted,
}: LawyerListPayload = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: [`lawyer-${page ?? "1"}`],
    queryFn: () => GetLawyerListQuery({ page, search, isDeleted, isBlock }),
  });
};
