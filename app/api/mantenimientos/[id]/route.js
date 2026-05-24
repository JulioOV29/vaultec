import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(_request, { params }) {
    try {
        const { id } = await params
        await prisma.mantenimiento.delete({ where: { id: Number(id) } })
        return NextResponse.json({ message: 'Mantenimiento eliminado' })
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}