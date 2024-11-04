import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/utils/axios";

const getRequests = ({
  referenceId,
  lawyer,
  status,
  page,
  role,
}: {
  referenceId: string | undefined;
  lawyer: string | undefined;
  status: string | undefined;
  page: number | undefined;
  role: string | undefined;
}): Promise<any> => {
  return axios.get(
    `/api/${role}/case-requests?referenceId=${referenceId}&lawyer=${lawyer}&status=${status}&page=${
      page ?? 1
    }`
  );
};

type QueryFnType = typeof getRequests;

type RequestTypesPayload = {
  config?: QueryConfig<QueryFnType>;
  referenceId?: string;
  lawyer?: string;
  status?: string;
  page?: number;
  role?: string;
};

export const useRequestTypes = (
  { config, referenceId, lawyer, status, page, role }: RequestTypesPayload = {
    referenceId: "",
    lawyer: "",
    status: "",
    page: 1,
    role: "",
  }
) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: [`request-types-${page ?? 1}`],
    queryFn: () => getRequests({ referenceId, lawyer, status, page, role }),
  });
};
