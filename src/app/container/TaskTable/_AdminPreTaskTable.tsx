"use client"

import { Spinner } from "@/components/Form/Spinner";
import Table from "@/components/Table/Table";
import { usePreTasks } from "@/queries/preTasks";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import view from "@/assets/view.png";
import edit from "@/assets/edit.png";
import del from "@/assets/delete.png";
import axios from "axios";
import useSnackbar from "@/hooks/useSnackbar";
import ConfirmationDialog from "@/components/Form/ConfirmationDialogue";

export const AdminPreTaskTable = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { data, isLoading, refetch } = usePreTasks({
        page: page?.toString() ?? '1'
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false); // State to track delete operation
    const { openSnackbar } = useSnackbar(); 

    const handleDeleteConfirm = async () => {
        if (selectedTaskId) {
            setDeleting(true); // Set deleting state to true
            try {
                await axios.delete(`/api/admin/pre-tasks/${selectedTaskId}`); 
                openSnackbar({message:"Task deleted successfully",type: "success"});
                refetch();
                setPage(1); 
                setOpenDialog(false);
            } catch (error) {
                openSnackbar({message:"Error deleting task",type: "error"});
            } finally {
                setDeleting(false); 
            }
        }
    };

    useEffect(()=>{
        refetch();
    },[page])

    if (isLoading) {
        return (
            <center>Loading...</center>
        )
    }

    return (
        <>
            <ConfirmationDialog
                open={openDialog}
                title="Delete Confirmation"
                message="Are you sure you want to delete this task? This action cannot be undone."
                loading={deleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setOpenDialog(false)}
            />

            <Table<any>
                data={data?.data ?? []}
                currentPage={data?.currentPage ?? 1}
                totalEntries={data?.totalEntries ?? 10}
                handlePageChange={(e, page) => {
                    setPage(page);
                }}
                columns={[
                    {
                        field: "title",
                        title: "Title",
                        Cell({ entry: { title } }: any) {
                            return <span>{title}</span>;
                        },
                    },
                    {
                        field: "category",
                        title: "Category",
                        Cell({ entry: { category } }: any) {
                            return <span>{category}</span>;
                        },
                    },
                    {
                        field: "createdAt",
                        title: "Created On",
                        Cell({ entry: { createdAt } }: any) {
                            return <span>{moment(createdAt).format("DD-MMM-YYYY")}</span>;
                        },
                    },
                    {
                        field: "validFor",
                        title: "Valid For(days)",
                    },
                    {
                        field: "actions",
                        title: "Actions",
                        Cell({
                            entry: { _id },
                        }: any) {
                            return (
                                <span className="admin-table-btns d-flex gap-2 cursor-pointer">
                                    {/* View */}
                                    <span
                                        title="View"
                                        onClick={() => {
                                            router.push(
                                                `/admin/pre-tasks/` + _id
                                            );
                                        }}
                                    >
                                        <Image src={view} alt="View" className="" />
                                    </span>
                                    {/* Edit */}
                                    <span
                                        title="Edit"
                                        onClick={() => {
                                            router.push(
                                                `/admin/pre-tasks/${_id}/edit`
                                            );
                                        }}
                                    >
                                        <Image src={edit} alt="Edit" className="" />
                                    </span>
                                    {/* Delete */}
                                    <span
                                        title="Delete"
                                        onClick={() => {
                                            setSelectedTaskId(_id); 
                                            setOpenDialog(true); 
                                        }}
                                    >
                                        <Image src={del} alt="Delete" className="" />
                                    </span>
                                </span>
                            );
                        },
                    },
                ]}
            />
        </>
    )
}
