import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/utils/axios";

const GetUserQuery = ({
  page,
  search,
}: {
  search: any;
  page: string | undefined | number;
}): Promise<any> => {
  return axios.get(
    `/api/admin/users/list?page=${page ?? "1"}&search=${encodeURIComponent(
      search || ""
    )}`
  );
};

type QueryFnType = typeof GetUserQuery;

type UserListPayload = {
  config?: QueryConfig<QueryFnType>;
  page?: string;
  search?: string | undefined | any;
};

export const useUserQuery = ({
  config,
  page,
  search,
}: // isBlock,
// isDeleted,
UserListPayload = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: [`user/list-${page ?? "1"}`],
    queryFn: () => GetUserQuery({ page, search }),
  });
};
