"use client"
import React, { useEffect, useState } from "react";
import { Input } from "./input";
import { Search } from "lucide-react";
import useDebounce from "@/app/hooks/useDebounce";

interface BinhSearchProps {
    data?: any;
    q?: string;
    onSearch: (query: string) => void;
}

const BinhSearch = ({ onSearch }: BinhSearchProps) => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        onSearch(debouncedSearch);
    }, [debouncedSearch, onSearch]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setSearch(e.target.value);
    }

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />

            <Input
                id="q"
                name="q"
                placeholder="Search..."
                value={search}
                onChange={handleChange}
                className="pl-9 pr-3 py-2 text-gray-800 bg-white border border-gray-300 selection:bg-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default BinhSearch;