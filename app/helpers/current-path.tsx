"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CurrentPath() {
    const pathname = usePathname();

    // Cắt path thành mảng, bỏ phần rỗng
    const segments = pathname.split("/").filter(Boolean);

    return (
        <div className="flex items-center gap-2 text-sm text-black">
            {segments.map((segment, index) => {
                // Tạo đường dẫn đầy đủ cho từng segment
                const href = "/" + segments.slice(0, index + 1).join("/");

                // Kiểm tra xem có phải segment cuối không
                const isLast = index === segments.length - 1;

                return (
                    <span key={href} className="flex items-center gap-2 ">
                        {!isLast ? (
                            <Link href={href} className="hover:text-black ">

                                <div className="px-2 py-0.5 capitalize text-black hover:text-bg-btn-dynamic">
                                    {segment}
                                </div>

                            </Link>
                        ) : (
                            <div className="px-2 py-0.5 capitalize text-bg-btn-dynamic border-b-2 border-bg-btn-dynamic">{segment}</div>
                        )}
                        {!isLast && <span>{">"}</span>}
                    </span>
                );
            })}
        </div>
    );
}
