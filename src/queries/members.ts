import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/utils/axios";
import { MemberApiResponse } from "@/types/Members";

const getMembersTypes = ({
  caseId,
  page,
}: {
  caseId?: string;
  page: string | undefined | number;
}): Promise<MemberApiResponse> => {
  return axios.get(
    `/api/client/case-member?caseId=${caseId}&page=${page ?? "1"}`
  );
};

type QueryFnType = typeof getMembersTypes;

type MembersTypesPayload = {
  config?: QueryConfig<QueryFnType>;
  caseId?: string;
  page?: string;
};

export const useMembersTypes = ({
  config,
  caseId,
  page,
}: MembersTypesPayload = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: [`member-types-${page ?? "1"}`],
    queryFn: () => getMembersTypes({ caseId, page }),
  });
};
