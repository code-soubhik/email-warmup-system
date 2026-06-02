'use server'

import { redirect } from 'next/navigation'
import argon2 from "argon2"
import prisma from '@/lib/prisma'

import { createSession, deleteSession } from '@/lib/authSession'
import { redis } from '@/lib/redis'
import { getClientIp } from '../utils/serverUtils';
import { sendEmail } from '@/lib/sendEMail'

if (!process.env.PEPPER) {
  throw new Error("Missing PEPPER env variable");
}

const PEPPER = process.env.PEPPER;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email: string, otp: string) {
  const html = `
    <div style="font-family: sans-serif; text-align: center;">
      <h2>Your OTP Code</h2>
      <p>Use the following OTP to continue:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "EMAIL WARMUP | OTP Verification",
    html
  });
}

// ─── Send OTP ────────────────────────────────────────────────────────────────

export async function sendOtpAction({ email }: { email: string }) {
  try {
    if (!email) return { error: 'Email is required.' };

    const ip = await getClientIp();
    const key = `otp:${email}:${ip}`;

    const otp = generateOtp();

    const hashOtp = await argon2.hash(otp + PEPPER);

    await redis.set(key, hashOtp, {
      expiration: { type: 'EX', value: 5 * 60 } // seconds
    });

    await sendOtpEmail(email, otp);

    return { success: true };
  } catch (err) {
    console.log("OTP ACTION: ", err);
    return { error: 'Something went wrong' };
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(prevState: { error: string }, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Email and password are required.' };
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return { error: 'Invalid credentials.' };
    }

    const isValid = await argon2.verify(
      user.password,
      password + PEPPER
    );

    if (!isValid) {
      return { error: 'Invalid credentials.' };
    }

    await createSession(user.id.toString());

    redirect('/');
  } catch (err) {
    throw err; // IMPORTANT: lets Next.js handle redirect cleanly
  }
}

// ─── Signup ───────────────────────────────────────────────────────────────────

export async function signupAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const otp = formData.get('otp') as string;

    if (!email || !password || !otp) {
      return { error: 'All fields are required.' };
    }

    const ip = await getClientIp();
    const key = `otp:${email}:${ip}`;

    const record = await redis.get(key);

    if (!record || typeof record !== "string") {
      return { error: 'No OTP found. Please request a new code.' };
    }

    const isMatched = await argon2.verify(
      record,
      otp + PEPPER
    );

    if (!isMatched) {
      return { error: 'Incorrect code. Please try again.' };
    }

    await redis.del(key); // prevent OTP reuse

    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return { error: 'Email already exists' };
    }

    const hashedPassword = await argon2.hash(
      password + PEPPER,
      { type: argon2.argon2id }
    );

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        provider: 'BASIC',
      },
    });

    await createSession(user.id.toString());

    redirect('/');
  } catch (err) {
    throw err; // IMPORTANT: prevents NEXT_REDIRECT logging issue
  }
}

export async function logoutAction() {
  try {
    await deleteSession();
    redirect('/login');
  } catch (err) {
    throw err; // IMPORTANT: prevents NEXT_REDIRECT logging issue
  }
}
