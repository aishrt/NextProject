import TaskModel from "@/models/tasks.model";
import db from "@/utils/connectDB";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    db.connectDB()
    try {
        let data = await req.json()
        let findTask = await TaskModel.findOne({ _id: data?.task_id })
        if (!findTask) {
            return NextResponse.json({
                data: {
                    status: 400,
                    message: "Task not found"
                }
            })
        }

        let UpdateTask = await TaskModel.updateOne({ _id: data?.task_id }, { ...data, submissionAt: moment(data?.submissionAt, 'DD/MM/YYYY'), validTill: moment(data?.validTill, "DD/MM/YYYY") }, { new: true })
        return NextResponse.json({
            data: {
                status: 200,
                message: "Task Updated successfully"
            }
        })

    } catch (error: any) {
        return NextResponse.json({
            message: error?.message || "Internal server error"
        })
    }
}