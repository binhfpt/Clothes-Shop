import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import Link from 'next/link'
import React from 'react'

const TableCategory = async () => {

  const res = await fetch(`${process.env.DOMAIN}/api/get/categories`, {
    cache: "no-store",
    method: "GET"
  })
  const { categories } = await res.json()
  return (
    <div className='flex flex-wrap ' id='rnos'>
      {categories.map((c: any) => (

        <Link href={`category/subcategories/${c.slug}`} className='hover:bg-[linear-gradient(to_bottom,var(--primary),var(--secondary))] ml-10 flex flex-wrap cursor-pointer hover:border-l-12 hover:border-btn-hv-bg transition-border duration-300 ease-in-out flex-col justify-center items-center w-[20%] gap-1 bg-background shadow-shadow-best rounded-3xl h-50 mb-10' key={c._id}>
          <h2 className='text-bg-btn-dynamic text-3xl font-semibold'>{c.name}</h2>
          <h4 className='text-lightground text-center'>{c.description} </h4>
        </Link>

      ))}
    </div>
  )
}

export default TableCategory