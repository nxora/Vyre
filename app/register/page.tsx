"use client"
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

function page() {

    const [username, setUser] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, email, password})
        })
        if (res.ok){
          await signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
          })
        } else{
          const data = await res.json()
          setMessage(data.error || "Registration failed");
        }
    }
  return (
   <div className="w-full max-w-sm mx-auto pt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
         <p>{message}</p>
        <input placeholder="Username" value={username} onChange={(e) => setUser(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" />
        <p className='text-gray-500 text text-center'>Already have an account <a href="/login">Login</a></p>
        <button className="bg-gray-600 text-white py-2 rounded cursor-pointer hover:bg-gray-400">Register</button>
      </form>
    </div>
  )
}

export default page
