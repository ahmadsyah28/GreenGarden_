// app/actions/userActions.js
'use server'

import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  try {
    await connectToDatabase();
    const users = await User.find({}).select('-password');
    
    // Konversi ke plain object untuk menghindari serialization error
    return { users: JSON.parse(JSON.stringify(users)) };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return { error: 'Failed to load users' };
  }
}

export async function createUser(formData) {
  try {
    await connectToDatabase();
    
    // Tangkap data dari FormData
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const phone = formData.get('phone');
    
    const user = await User.create({
      name,
      email,
      password, // Seharusnya di-hash sebelum disimpan
      phone
    });
    
    // Refresh data
    revalidatePath('/users');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to create user:', error);
    return { error: error.message };
  }
}