import CerQuestions from "@/models/cerQuestion.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        let id = req.nextUrl.searchParams.get('id')
        let findQues = await CerQuestions.findOne({_id:id})
        if(!findQues){
            return NextResponse.json({
                message:"Question not found"
            },{
                status:400
            })
        }
        return NextResponse.json({
            message: "Get Questions data",
            
              data: findQues,
           
          
        })
    } catch (error:any) {
        return NextResponse.json(
            {message:error?.message ??"Internal server error"},
            {status:400}
        )
    }
    
}