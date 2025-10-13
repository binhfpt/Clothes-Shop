
export const getTotalPage = (array: Array<any>, pageSize: number) => {
    return Math.ceil(array.length / pageSize)
}

export const getPageData = (array: any[], pageSize: number, page: number) => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return array.slice(startIndex, endIndex)
}

