export type TasksType = {
    _id: string;
    title: string;
    submissionAt: Date;
    validTill: Date;
    case_id: object;
    description: string;

    createdAt: string;
    updatedAt: string;
    case__id: any;
    category: any;
    status: any;
    __v: boolean;
    actions: any;
};

export type TasksTypeApiResponse = {
    data: TasksType[];
    page?: number;
    currentPage: number;
    totalEntries: number;
};
