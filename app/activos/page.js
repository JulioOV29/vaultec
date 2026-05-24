'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ActivoForm from '@/components/ActivoForm'
import ActivoTable from '@/components/ActivoTable'

export default function ActivosPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [activos, setActivos] = useState([])
    const [activoEditar, setActivoEditar] = useState(null)
    const [mostrarForm, setMostrarForm] = useState(false)

    const cargarActivos = async () => {
        const res = await fetch('/api/activos')
        const data = await res.json()
        setActivos(data)
    }

    useEffect(() => {
        cargarActivos()
    }, [])

    const handleGuardado = () => {
        cargarActivos()
        setMostrarForm(false)
        setActivoEditar(null)
    }

    const handleEditar = (activo) => {
        setActivoEditar(activo)
        setMostrarForm(true)
    }

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este activo?')) return
        await fetch(`/api/activos/${id}`, { method: 'DELETE' })
        cargarActivos()
    }

    const handleCancelar = () => {
        setActivoEditar(null)
        setMostrarForm(false)
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vaultec</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Bienvenido, {session?.user?.nombre} —{' '}
                        <span className="text-blue-600 font-medium">{session?.user?.rol}</span>
                    </p>
                </div>

                <div className="flex gap-3">
                    {session?.user?.rol === 'ADMIN' && (
                        <button
                            onClick={() => router.push('/usuarios')}
                            className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                        >
                            Usuarios
                        </button>
                    )}

                    <button
                        onClick={() => {
                            setActivoEditar(null)
                            setMostrarForm(!mostrarForm)
                        }}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                        {mostrarForm ? 'Cerrar' : '+ Nuevo Activo'}
                    </button>

                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {/* Formulario */}
            {mostrarForm && (
                <ActivoForm
                    onGuardado={handleGuardado}
                    activoEditar={activoEditar}
                    onCancelar={handleCancelar}
                />
            )}

            {/* Tabla */}
            <ActivoTable
                activos={activos}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
            />

        </main>
    )
}