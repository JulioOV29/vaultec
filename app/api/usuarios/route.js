import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// GET — listar usuarios
export async function GET() {
    try {
        const usuarios = await prisma.user.findMany({
            select: { id: true, email: true, nombre: true, rol: true, creadoEn: true }
        })
        return NextResponse.json(usuarios)
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

// POST — crear usuario
export async function POST(request) {
    try {
        const { email, password, nombre, rol } = await request.json()
        const hashed = await bcrypt.hash(password, 10)

        const usuario = await prisma.user.create({
            data: { email, password: hashed, nombre, rol: rol || 'USER' }
        })

        return NextResponse.json({
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            rol: usuario.rol
        }, { status: 201 })
    } catch (e) {
        if (e.code === 'P2002')
            return NextResponse.json({ error: 'El email ya existe' }, { status: 409 })
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}