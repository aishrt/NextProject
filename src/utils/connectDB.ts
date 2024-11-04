import Case from '@/models/case.model';
import Expert from '@/models/expert.model';
import TaskModel from '@/models/tasks.model';
import User from '@/models/user.model';
import mongoose from 'mongoose'

async function connectDB() {
    const url = process.env?.MONGODB_URL ?? '';
    await mongoose.connect(url)
    await Case.findOne();
    await User.findOne();
    await Expert.findOne();
    await TaskModel.findOne();
    console.log('Connected.')
}

const db = { connectDB }
export default db
