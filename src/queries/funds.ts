import { CaseApiResponse } from "@/types/Cases";
import { axios } from "@/utils/axios";
import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";

// Updated getTasksList function
export const getFundsList = (
  page: number = 1,
  search?: string,
  count?: number,

  id?: string
): Promise<CaseApiResponse> => {
  const queryParams = new URLSearchParams();

  // Adding parameters to query string if provided
  if (page) queryParams.append("page", page.toString());
  if (search) queryParams.append("search", search);
  if (count) queryParams.append("count", count?.toString() || "10");

  if (id) queryParams.append("id", id);

  return axios.get(`/api/fund/?${queryParams.toString()}`);
};

type QueryFnType = typeof getFundsList;

type FundPayload = {
  config?: QueryConfig<QueryFnType>;
  page?: number;
  search?: string;
  count?: number;

  id?: string;
};

// Updated useTasksList hook
export const useFundList = (
  { config, search, page = 1, count = 10, id }: FundPayload = { page: 1 }
) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: [`tasks-${page}-${search}-${count}`],
    queryFn: () => getFundsList(page, search, count, id),
  });
};
