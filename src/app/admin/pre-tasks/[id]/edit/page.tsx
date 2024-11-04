
import React from "react";
import "../../../../admin/admin.css";

import AdminTaskForm from "@/app/container/AddTask/_adminAdd";


export default function EditTask({ params }: { params: { id: string } }) {
    const id = params.id;
    return (
        <div className="main-content expert-cases">
            <div className="top-br d-flex justify-content-between align-items-center">
                <h2 className="f-24">Edit Task</h2>
            </div>
            <div className="">
                <div className=" mt-4">
                    <AdminTaskForm taskId={id} />
                </div>
            </div>
        </div>
    );
}