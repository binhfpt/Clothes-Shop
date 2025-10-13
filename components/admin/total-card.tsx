import React from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'

const TotalCard = ({ amount, forward }: any) => {
  return (
    <div className='flex flex-col border-b-1 border-btn-hv-bg  gap-4 px-12 py-8 w-fit text-center text-black items-center'>
      <div className='flex items-baseline'>
        <p>Total:</p>
        <p className='text-bg-btn-dynamic text-2xl font-semibold'>{amount}</p>
      </div>
      <Link href={forward}>
        <Button className='bg-bg-btn-dynamic text-white hover:bg-btn-hv-bg w-[100px] cursor-pointer'>Add</Button>
      </Link>
    </div>
  )
}

export default TotalCard
