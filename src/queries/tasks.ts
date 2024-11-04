import { CaseApiResponse } from "@/types/Cases";
import { axios } from "@/utils/axios";
import { ExtractFnReturnType, QueryConfig } from "./react-query";
import { useQuery } from "@tanstack/react-query";

// Updated getTasksList function
export const getTasksList = (
    page: number = 1,
    submissionAt?: string,
    validTill?: string,
    search?: string,
    count?: number,
    role?: string,
    id?: string,
    task_id?: string,
    status?: string
): Promise<CaseApiResponse> => {
    const queryParams = new URLSearchParams();

    // Adding parameters to query string if provided
    if (page) queryParams.append('page', page.toString());
    if (submissionAt) queryParams.append('submissionAt', submissionAt);
    if (validTill) queryParams.append('validTill', validTill);
    if (search) queryParams.append('search', search);
    if (count) queryParams.append('count', count?.toString() || '10');
    if (role) queryParams.append('role', role);
    if (id) queryParams.append('id', id);
    if (task_id) queryParams.append('task_id', task_id);
    if (status) queryParams.append('status', status);

    return axios.get(`/api/task/list/?${queryParams.toString()}`);
}

type QueryFnType = typeof getTasksList;

type CasePayload = {
    config?: QueryConfig<QueryFnType>;
    page?: number;
    submissionAt?: string;
    validTill?: string;
    search?: string;
    count?: number;
    role?: string;
    id?: string;
    task_id?: string;
    status?: string;
};

// Updated useTasksList hook
export const useTasksList = ({
    config,
    page = 1,
    submissionAt,
    validTill,
    search,
    count = 10,
    role,
    id,
    task_id,
    status,
}: CasePayload = { page: 1 }) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: [
            `tasks-${page}-${submissionAt}-${validTill}-${search}-${count}-${role}-${id}-${task_id}-${status}`,
        ],
        queryFn: () =>
            getTasksList(
                page,
                submissionAt,
                validTill,
                search,
                count,
                role,
                id,
                task_id,
                status
            ),
    });
};
