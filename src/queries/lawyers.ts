import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/utils/axios";

const getLawyerTypes = ({ page }: {page: string | undefined | number}): Promise<any> => {
    return axios.get(`/api/admin/lawyer-types?page=${page ?? '1'}`);
};

type QueryFnType = typeof getLawyerTypes;

type LawyerTypesPayload = {
    config?: QueryConfig<QueryFnType>;
    page?: string;
};

export const useLawyerTypes = ({ config, page }: LawyerTypesPayload = {}) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: [`lawyer-types-${page ?? '1'}`],
        queryFn: () => getLawyerTypes({ page }),
    });
};
