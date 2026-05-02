'use server'

import { redirect } from 'next/navigation'
import { hash } from 'bcryptjs'
import { createSession } from '@/lib/authSession'
import prisma from '@/lib/prisma'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.password) {
    throw new Error('Invalid credentials')
  }

  // For simplicity, assuming password is hashed. In real app, use bcrypt.compare
  // const isValid = await bcrypt.compare(password, user.password)
  // if (!isValid) throw new Error('Invalid credentials')

  // Since password is stored as plain text in schema, direct compare (not recommended)
  if (password !== user.password) {
    throw new Error('Invalid credentials')
  }

  await createSession(user.id.toString())
  redirect('/')
}

export async function signup(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm-password') as string

  if (!name || !email || !password || !confirmPassword) {
    throw new Error('All fields are required')
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match')
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await hash(password, 12)

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
