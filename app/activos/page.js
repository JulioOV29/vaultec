'use client'
import { useState, useEffect } from 'react'
import ActivoForm from '@/components/ActivoForm'
import ActivoTable from '@/components/ActivoTable'

export default function ActivosPage() {
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
                        Gestión de Activos Tecnológicos
                    </p>
                </div>
                <button
                    onClick={() => {
                        setActivoEditar(null)
                        setMostrarForm(!mostrarForm)
                    }}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                    {mostrarForm ? 'Cerrar' : '+ Nuevo Activo'}
                </button>
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