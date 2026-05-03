'use server'

import { redirect } from 'next/navigation'
import { compare, compareSync, hashSync } from 'bcryptjs'
import { createSession } from '@/lib/authSession'
import prisma from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { getClientIp } from '../utils/serverUtils';
import { sendEmail } from '@/lib/sendEMail'

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
  await sendEmail({ to: email, subject: "EMAIL WARMUP | OTP Verification", html });
}

// ─── Send OTP (called on first "Create account" click) ────────────────────────
export async function sendOtp({ email }: { email: string }) {
  if (!email) return { error: 'Email is required.' };

  const ip = await getClientIp();
  const key = `otp:${email}:${ip}`;

  const otp = generateOtp();
  const hashOtp = hashSync(otp.toString(), 10);

  await redis.set(key, hashOtp, { expiration: { type: 'EX', value: 5 * 60 * 1000 } });

  await sendOtpEmail(email, otp);

  return { success: true }
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function login(prevState: { error: string }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.password) {
    return { error: 'Invalid credentials.' }
  }

  const isValid = await compare(password, user.password)
  if (!isValid) {
    return { error: 'Invalid credentials.' }
  }

  await createSession(user.id.toString())
  redirect('/')
}

// ─── Signup (called on second "Verify & Create account" click) ────────────────
export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const otp = formData.get('otp') as string

  if (!email || !password || !otp) {
    return { error: 'All fields are required.' }
  }

  // ── Verify OTP ──
  const ip = await getClientIp();
  const key = `otp:${email}:${ip}`;
  const record = await redis.get(key);

  if(!record){
    return { error: 'No OTP found. Please request a new code.' }
  }
  
  const isMatched = compareSync(otp.toString(), record);

  if (!isMatched) {
    return { error: 'Incorrect code. Please try again.' }
  }

  // // ── Create user ──
  const hashedPassword = hashSync(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      provider: 'BASIC',
    },
  })

  await createSession(user.id.toString())
  redirect('/')
}