import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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