"use client"

import Link from "next/link"
import ThanhTimKiem from "@/components/ui/thanh-tim-kiem"
import { Button } from "@/components/ui/button"

interface ThaoTacThuongHieuProps {
    onSearch: (query: string) => void
}

export default function ThaoTacThuongHieu({ onSearch }: ThaoTacThuongHieuProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <ThanhTimKiem
                placeholder="Tìm kiếm theo tên thương hiệu..."
                onSearch={onSearch}
            />
            <Link href="/brands/add" passHref>
                <Button className="w-full md:w-auto">
                    <i className="fas fa-plus mr-2"></i>
                    Thêm thương hiệu
                </Button>
            </Link>
        </div>
    )
}