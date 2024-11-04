import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/utils/connectDB';
import PreTasksModel from '@/models/preTasks.model';


export async function POST(req: NextRequest) {

    await db.connectDB();

    try {
        const body = await req.json();

        const newTask = await PreTasksModel.create(body);

        return NextResponse.json({ message: 'Task created successfully', task: newTask }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

// Handle GET request to fetch tasks
export async function GET(req: NextRequest) {

    await db.connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        const skip = (page - 1) * limit;

        const tasks = await PreTasksModel.find({})
            .skip(skip)
            .limit(limit)
            .exec();

        const totalTasks = await PreTasksModel.countDocuments({});


        return NextResponse.json({
            data: {
                data: tasks,
                currentPage: page,
                totalEntries: totalTasks,
            },
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}
