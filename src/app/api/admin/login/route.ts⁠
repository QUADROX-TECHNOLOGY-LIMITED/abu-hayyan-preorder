import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { comparePasswords, hashPassword, signJWT } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ status: 'error', message: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const adminCount = await prisma.admin.count();

    // --- FIRST-TIME BROWSER SETUP ---
    // If no admin exists in the DB, the first credentials submitted automatically create the Admin
    if (adminCount === 0) {
      const hashedPassword = await hashPassword(password);
      const newAdmin = await prisma.admin.create({
        data: { email: cleanEmail, password: hashedPassword }
      });

      const token = await signJWT({ id: newAdmin.id, email: newAdmin.email });
      const response = NextResponse.json({ 
        status: 'success', 
        isSetup: true,
        message: 'Admin account created successfully!' 
      });

      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60, // 8 Hours
        path: '/',
      });

      return response;
    }

    // --- REGULAR LOGIN FLOW ---
    const admin = await prisma.admin.findUnique({
      where: { email: cleanEmail }
    });

    if (!admin) {
      return NextResponse.json({ status: 'error', message: 'Invalid credentials.' }, { status: 401 });
    }

    // 1. Strict Lockout Check
    if (admin.isLocked) {
      return NextResponse.json({
        status: 'locked',
        message: 'Account is locked due to excessive failed login attempts.'
      }, { status: 423 });
    }

    // 2. Password Verification
    const isMatch = await comparePasswords(password, admin.password);

    if (!isMatch) {
      const newFailedCount = admin.failedAttempts + 1;
      const willLock = newFailedCount >= 3;

      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          failedAttempts: newFailedCount,
          isLocked: willLock
        }
      });

      if (willLock) {
        return NextResponse.json({
          status: 'locked',
          message: 'Account suspended! 3 consecutive failed attempts detected.'
        }, { status: 423 });
      }

      const attemptsLeft = 3 - newFailedCount;
      return NextResponse.json({
        status: 'error',
        message: `Invalid credentials. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`
      }, { status: 401 });
    }

    // 3. Success: Reset failed counter & set HTTP-Only Session Cookie
    await prisma.admin.update({
      where: { id: admin.id },
      data: { failedAttempts: 0 }
    });

    const token = await signJWT({ id: admin.id, email: admin.email });
    const response = NextResponse.json({ status: 'success', message: 'Login successful.' });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 Hours
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
