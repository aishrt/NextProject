import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";
import { CaseApiResponse, Cases } from "@/types/Cases";
import { PaginateClient, PaginateData } from "@/types/Paginate";
import { axios } from "@/utils/axios";

export const getCases = (
  referenceId?: string,
  name?: string,
  lawyer?: string,
  status?: string,
  submissionDate?: string,
  updatedDate?: string,
  type?: string,
  role?: string,
  user?: string,
  page: number = 1,
  dataPerPage?: number
): Promise<CaseApiResponse> => {
  if (role == "lawyer") {
    return axios.get(
      `/api/lawyer/case-list?page=${page ?? 1}&referenceId=${
        referenceId ?? ""
      }&name=${name ?? ""}&lawyer=${lawyer ?? ""}&status=${
        status ?? ""
      }&submissionDate=${submissionDate ?? ""}&updatedDate=${
        updatedDate ?? ""
      }&type=${type ?? ""}&role=lawyer&dataPerPage=${dataPerPage ?? 10}`
    );
  }
  if (
    referenceId ||
    name ||
    lawyer ||
    status ||
    submissionDate ||
    updatedDate
  ) {
    return axios.get(
      `/api/client/case/get-case?page=${
        page ?? 1
      }&referenceId=${referenceId}&name=${name ?? ""}&lawyer=${
        lawyer ?? ""
      }&status=${status}&submissionDate=${submissionDate ?? ""}&updatedDate=${
        updatedDate ?? ""
      }&type=${type}&role=${role}`
    );
  }
  return axios.get(
    `/api/client/case/get-case?type=${type ?? ""}&role=${role}&page=${
      page ?? 1
    }&user=${role == "client" ? user : ""}&dataPerPage=${dataPerPage ?? 10}`
  );
};

type QueryFnType = typeof getCases;

type CasePayload = {
  config?: QueryConfig<QueryFnType>;
  referenceId?: string;
  name?: string;
  lawyer?: string;
  status?: string;
  submissionDate?: string;
  updatedDate?: string;
  uploadedBy?: string;
  type?: string;
  role?: string;
  user?: string;
  page: number;
  dataPerPage?: number;
};

export const useCases = (
  {
    config,
    referenceId,
    name,
    lawyer,
    status,
    submissionDate,
    updatedDate,
    type,
    role,
    user,
    page,
    dataPerPage,
  }: CasePayload = { page: 1 }
) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: [`cases-${page ?? ""}`],
    queryFn: () =>
      getCases(
        referenceId,
        name,
        lawyer,
        status,
        submissionDate,
        updatedDate,
        type,
        role,
        user,
        page,
        dataPerPage || 10
      ),
  });
};
