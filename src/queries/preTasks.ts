import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/utils/axios";

const getPreTasks = ({ page }: {page: string | undefined | number}): Promise<any> => {
    
    return axios.get(`/api/admin/pre-tasks?page=${page ?? '1'}`);
};

type QueryFnType = typeof getPreTasks;

type LawyerDocsPayload = {
    config?: QueryConfig<QueryFnType>;
    page?: string ;
};

export const usePreTasks = ({ config, page }: LawyerDocsPayload = {}) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: [`lawyer-docs-${page ?? '1'}`],
        queryFn: () => getPreTasks({ page }),
    });
};