"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../../admin/admin.css";
import Link from "next/link";
import './style.css'
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { User, UserApiResponse } from "@/types/User";
import axios from "axios";
import { useSession } from "next-auth/react";

const TaskForm = ({ data, case_id }: { data: UserApiResponse | undefined, case_id: any }) => {

    const router = useRouter();
    const { data: session, status } = useSession();

    const [QuestionData, setQustionData] = useState([{ answer: '', _id: '' }])
    const [form, setform] = useState({ title: "", description: "", submissionAt: "", validTill: "" })
    const [loadingData, setDataLoading] = useState(false);
    const [caseData, setCaseData] = React.useState({ _id: "", progress: "" });
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();

    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const [page, setPage] = useState(1);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const formHandler = (e: any, itm: any, i: any) => {
        const arry = [...QuestionData];
        arry[i]["answer"] = e.target.value


        setQustionData(arry)
    }
    const InputHandler = (e: any) => {
        if (e.target.name == 'submissionAt' || e.target.name == 'validTill') {
            setform({ ...form, [e.target.name]: moment(e.target.value).format('DD/MM/YYYY') })

        } else {

            setform({ ...form, [e.target.name]: e.target.value })
        }
    }

    const HandleSubmit = (e: any) => {
        e.preventDefault()
        let value = { ...form, case_id }
        axios.post('/api/task/add', value).then((res: any) => {
            if (res?.status == 200) {
                router.push('/expert/tasks')
            }
        })

    }


    return (
        <div className="cases-list-table expert-table">
            <form onSubmit={HandleSubmit}>
                <div className="flex flex-col mt-5 w-1/2">
                    <h6 className="flex">Task Detials</h6>
                    <div className="flex flex-row graph_dev mt-5">
                        <h6 className="flex">Title</h6>

                        <input required className="form-control graph_input" name="title" onChange={InputHandler} type="text" placeholder="" />
                    </div>
                    <div className="flex flex-row graph_dev mt-3">
                        <h6 className="flex">Description</h6>
                        <input required className="form-control graph_input" name="description" onChange={InputHandler} type="text" placeholder="" />
                    </div>
                    <div className="flex flex-row graph_dev mt-3">
                        <h6 className="flex">Submission Date</h6>
                        <input required className="form-control graph_input" name="submissionAt" onChange={InputHandler} type="date" placeholder="" />
                    </div>
                    <div className="flex flex-row graph_dev mt-3">
                        <h6 className="flex">Valid Till</h6>
                        <input required className="form-control graph_input" name="validTill" onChange={InputHandler} type="date" placeholder="" />
                    </div>
                    <div className="flex flex-row graph_dev mt-3">
                        <h6 className="flex">Role</h6>
                        <select onChange={InputHandler} name="role" id="">
                            <option value="">Select Role</option>
                            <option value="client">Client</option>
                            <option value="expert">Expert</option>
                            <option value="lawyer">Lawyer</option>

                        </select>
                    </div>
                </div>
                <div style={{ width: "20%" }} className="mt-5">
                    <button className="form-control" type="submit">Submit</button>
                </div>
            </form>

       
        </div>
    );
};

export default TaskForm;
