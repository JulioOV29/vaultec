import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(_request, { params }) {
    try {
        const { id } = await params
        await prisma.user.delete({ where: { id: Number(id) } })
        return NextResponse.json({ message: 'Usuario eliminado' })
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}