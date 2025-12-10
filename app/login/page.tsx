"use client"
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

function page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (!res?.ok) {
      alert("Invalid credentials")
    } else {
      window.location.href = "/"
    }

  }
  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto pt-20">
      <h1 className='text-2xl font-bold mb-6'>Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" />
        <p className='text-gray-500 text text-center'>Don't have an account <a href="/register">Sign Up</a></p>
        <button className="bg-gray-600 text-white py-2 rounded cursor-pointer hover:bg-gray-400">Login</button>
      </form>
    </div>
  )
}

export default page
