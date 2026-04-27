import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET — listar todos los activos
export async function GET() {
    try {
        const activos = await prisma.activo.findMany({
            orderBy: { creadoEn: 'desc' }
        })
        return NextResponse.json(activos)
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

// POST — crear un activo
export async function POST(request) {
    try {
        const body = await request.json()
        const { nombre, tipo, serial, fechaCompra, estado, responsable } = body

        const nuevo = await prisma.activo.create({
            data: {
                nombre,
                tipo,
                serial,
                fechaCompra: new Date(fechaCompra),
                estado,
                responsable
            }
        })
        return NextResponse.json(nuevo, { status: 201 })
    } catch (e) {
        if (e.code === 'P2002')
            return NextResponse.json({ error: 'El serial ya existe' }, { status: 409 })
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}