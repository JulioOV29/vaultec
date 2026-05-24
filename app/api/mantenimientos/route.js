import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { activoId, titulo, descripcion, tecnico } = await request.json()

        const mantenimiento = await prisma.mantenimiento.create({
            data: {
                activoId: Number(activoId),
                titulo,
                descripcion,
                tecnico
            }
        })
        return NextResponse.json(mantenimiento, { status: 201 })
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}