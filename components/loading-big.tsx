import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingBig = () => {
    return (
        <div className='flex flex-col gap-4 m-auto inset-0 items-center mt-40'>
            <Loader2 className="h-36 w-36 animate-spin text-bg-btn-dynamic" />
            <div className='flex flex-col gap-2 items-center'>
                <h1 className='text-gray-700 text-5xl font-bold'>Loading</h1>
                <h3 className='text-lightground'>We are loading it right now, please wait a minute</h3>
            </div>
        </div>
    )
}

export default LoadingBig