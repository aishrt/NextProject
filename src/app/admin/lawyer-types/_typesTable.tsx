"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import "../../admin/admin.css";
import edit from "@/assets/edit.png";
import del from "@/assets/delete.png";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Image from "next/image";
import moment from "moment";
import { useLawyerTypes } from "@/queries/lawyers";
import axios from "axios";

const TypesTable = () => {
    const [page, setPage] = useState(1);
    const { data, refetch, isLoading } = useLawyerTypes({
        page: page.toString()
    })
    const router = useRouter();
    const theme = useTheme();

    useEffect(() => {
        refetch()
    }, [page])

    const deleteLawyer =async(id: string)=>{
        try{
    await axios.delete(`/api/admin/lawyer-types/${id!}`);
        }catch(err){
            console.log(err)
        }finally{
            refetch();
        }
    }


    return (
        <div className="cases-list-table expert-table">
            {isLoading ?
                <p>Loading...</p> :
                <Table<any>
                    data={data?.data ?? []}
                    currentPage={data?.currentPage ?? 1}
                    totalEntries={data?.totalEntries ?? 10}
                    handlePageChange={(e, page) => {
                        console.log(page);
                        setPage(page);
                    }}
                    columns={[
                        {
                            field: "name",
                            title: "Type",
                            Cell({ entry: { name } }) {
                                return <span>{name}</span>;
                            },
                        },
                        {
                            field: "createdAt",
                            title: "Listed On",
                            Cell({ entry: { createdAt } }) {
                                return <span>{moment(createdAt).format('DD MMM YYYY')}</span>;
                            },
                        },
                        {
                            field: "updatedAt",
                            title: "Last Updated",
                            Cell({ entry: { updatedAt } }) {
                                return <span>{moment(updatedAt).format('DD MMM YYYY')}</span>;
                            },
                        },
                        {
                            field: "actions",
                            title: "Action",
                            Cell({ entry: { _id } }) {
                                return (
                                    <span className="admin-table-btns d-flex gap-2 cursor-pointer">
                                        <span onClick={() => router.push(`/admin/lawyer-types/edit?id=${_id}`)}>
                                            <Image src={edit} alt="" className="" />
                                        </span>
                                        <span className="cursor-pointer" onClick={()=>deleteLawyer(_id)}>
                                            <Image src={del} alt="" className="" />
                                        </span>
                                    </span>
                                );
                            },
                        },
                    ]}
                />
            }
        </div>
    );
};

export default TypesTable;