import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/connectDB';
import PreTasksModel from '@/models/preTasks.model';

// Get a task by ID (GET /api/tasks/[id])
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await db.connectDB();

  try {
    const task = await PreTasksModel.findById(params.id);

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ data: task, message: "Data fetched successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// Update a task by ID (PUT /api/tasks/[id])
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await db.connectDB();

  try {
    const body = await req.json();

    console.log(body)

    const updatedTask = await PreTasksModel.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task updated successfully', task: updatedTask }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// Delete a task by ID (DELETE /api/tasks/[id])
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await db.connectDB();

  try {
    const deletedTask = await PreTasksModel.findByIdAndDelete(params.id);

    if (!deletedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
