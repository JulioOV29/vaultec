import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET — obtener un activo por id con su historial de mantenimientos
export async function GET(_request, { params }) {
    try {
        const { id } = await params
        const activo = await prisma.activo.findUnique({
            where: { id: Number(id) },
            include: {
                Mantenimiento: {
                    orderBy: { fecha: 'desc' }
                }
            }
        })
        if (!activo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
        return NextResponse.json(activo)
    } catch (e) {
        console.error('ERROR GET activo:', e.message)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

// PUT — editar un activo
export async function PUT(request, { params }) {
    try {
        const { id } = await params
        const body = await request.json()
        const { nombre, tipo, serial, fechaCompra, estado, responsable } = body

        const actualizado = await prisma.activo.update({
            where: { id: Number(id) },
            data: {
                nombre,
                tipo,
                serial,
                fechaCompra: new Date(fechaCompra),
                estado,
                responsable
            }
        })
        return NextResponse.json(actualizado)
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

// DELETE — eliminar un activo
export async function DELETE(_request, { params }) {
    try {
        const { id } = await params
        await prisma.activo.delete({ where: { id: Number(id) } })
        return NextResponse.json({ message: 'Activo eliminado correctamente' })
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}