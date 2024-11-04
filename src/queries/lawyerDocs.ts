import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/utils/axios";

const getLawyerDocs = ({ page }: {page: string | undefined | number}): Promise<any> => {
    return axios.get(`/api/admin/lawyers?page=${page ?? '1'}`);
};

type QueryFnType = typeof getLawyerDocs;

type LawyerDocsPayload = {
    config?: QueryConfig<QueryFnType>;
    page?: string ;
};

export const useLawyerDocs = ({ config, page }: LawyerDocsPayload = {}) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: [`lawyer-docs-${page ?? '1'}`],
        queryFn: () => getLawyerDocs({ page }),
    });
};
