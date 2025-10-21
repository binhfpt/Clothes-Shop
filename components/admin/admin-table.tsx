"use client"
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { BadgeCheckIcon, BadgeXIcon, Settings, UserX } from 'lucide-react'
import { BinhDropdownMenuGeneric } from './drop-down-setting'
import toast from 'react-hot-toast'

type HeaderType = {
    atri: string
    w: string // e.g., "200px", "auto", "1/4"
}

type CellType = {
    atri: string
}

interface AdminDataTableProps {
    data: any[]
    header: HeaderType[]
    cell: CellType[]
    onEvent?: (id: string, type: string) => void
}

const AdminDataTable = ({ data, header, cell, onEvent }: AdminDataTableProps) => {

    const renderCellContent = (attribute: string, value: any) => {
        // Xử lý trường isActive
        if (attribute === "isActive") {
            return value ? (
                <Badge
                    variant="secondary"
                    className="bg-blue-500 text-white dark:bg-blue-600 flex items-center gap-1 w-fit"
                >
                    <BadgeCheckIcon className="w-4 h-4" />
                    Active
                </Badge>
            ) : (
                <Badge
                    variant="secondary"
                    className="bg-red-500 text-white dark:bg-red-600 flex items-center gap-1 w-fit"
                >
                    <BadgeXIcon className="w-4 h-4" />
                    Inactive
                </Badge>
            )
        }

        // Xử lý trường createdAt
        if (attribute === "createdAt" && typeof value === "string") {
            return new Date(value).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        }

        // Trả về giá trị mặc định
        return value ?? '-'
    }

    const handleDelete = (id: string) => {
        if (onEvent) {
            onEvent(id, "delete")
        }

    }

    const handleEdit = (id: string) => {
        if (onEvent) {
            onEvent(id, "edit")
        }

    }

    return (
        <Table>
            <TableHeader className='h-15 border-b-2 border-btn-hv-bg'>
                <TableRow className="bg-background h-15">
                    {header.map((h, index) => (
                        <TableHead
                            key={index}
                            className='text-lightground font-semibold'
                            style={{ width: h.w }}
                        >
                            {h.atri}
                        </TableHead>
                    ))}
                    <TableHead className='text-lightground' style={{ width: '100px' }}>
                        Action
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody className='h-60'>
                {data.length === 0 ? (
                    <TableRow className='h-17'>
                        <TableCell
                            colSpan={header.length + 1}
                            className="text-center text-lightground py-8"
                        >
                            No data available
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((dt: any) => (
                        <TableRow key={dt._id} className="border-b-2 border-foreground h-17">
                            {cell.map((c, idx) => (
                                <TableCell key={idx}>
                                    {renderCellContent(c.atri, dt[c.atri])}
                                </TableCell>
                            ))}
                            <TableCell>
                                <BinhDropdownMenuGeneric
                                    data={dt}
                                    options={[
                                        {
                                            label: "Delete",
                                            icon: <UserX className="w-4 h-4" />,
                                            onClick: () => handleDelete(dt._id),
                                        },
                                        {
                                            label: "Edit",
                                            icon: <Settings className="w-4 h-4" />,
                                            onClick: () => handleEdit(dt._id),

                                        },
                                    ]}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}

export default AdminDataTable