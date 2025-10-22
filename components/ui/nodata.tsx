import React from 'react'

const NoDataFound = () => {
    return (
        <div className='flex flex-col gap-5 m-auto inset-0 items-center mt-10'>
            <img src={"/undraw_no-data_ig65.svg"} width={250} alt='nodata'></img>
            <div className='flex flex-col gap-1 items-center'>
                <h1 className='text-bg-btn-dynamic text-5xl font-bold'>No Results found</h1>
                <h3 className='text-lightground'>We could'nt found what you need sorry :D</h3>
            </div>
        </div>
    )
}

export default NoDataFound