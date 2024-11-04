import ClaimFinancialModel from "@/models/claim_financial.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        db.connectDB()
        let id = req.nextUrl.searchParams.get('id')
        let findReport = await ClaimFinancialModel.findOne({case_id:id})
        if(!findReport ){
            return NextResponse.json({
                data:{
                    status:400,
                    message:"Report not found"
                }
            })
        }
        if(findReport ){
            return NextResponse.json({
                data:{
                    status:200,
                    data:findReport,
                    message:"Report fethed successfully"
                }
            })
        }
    } catch (error:any) {
        return NextResponse.json({
            message:error?.message||"Internal server error"
        })
    }
    
}