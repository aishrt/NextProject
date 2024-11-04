import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types/Category";
import { PaginateClient, PaginateData } from "@/types/Paginate";
import { axios } from "@/utils/axios";

export const getCategories = ({ page }: PaginateClient): Promise<PaginateData<Category>> => {
    return axios.get(`/api/category?page=${page ?? ''}`)
};

type QueryFnType = typeof getCategories;

type CategoryPayload = {
    config?: QueryConfig<QueryFnType>;
    page?: number;
};

export const useCategories = ({config, page}: CategoryPayload = {}) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: [`categories-${page ?? ''}`],
        queryFn: ()=> getCategories({ page })
    })
}