'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Monitor, Users, LogOut, Plus } from 'lucide-react'
import ActivoForm from '@/components/ActivoForm'

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

    useEffect(() => { cargarActivos() }, [])

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

    const total = activos.length
    const activos_ = activos.filter(a => a.estado === 'Activo').length
    const mantenimiento = activos.filter(a => a.estado === 'En mantenimiento').length
    const dadosBaja = activos.filter(a => a.estado === 'Dado de baja').length

    const fecha = new Date().toLocaleDateString('es-CO', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    const ESTADO_COLORS = {
        'Activo': 'text-green-600',
        'En mantenimiento': 'text-yellow-600',
        'Dañado': 'text-red-600',
        'Dado de baja': 'text-gray-400',
    }

    const ESTADO_DOT = {
        'Activo': 'bg-green-500',
        'En mantenimiento': 'bg-yellow-500',
        'Dañado': 'bg-red-500',
        'Dado de baja': 'bg-gray-400',
    }

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 flex flex-col justify-between py-6 px-4 fixed h-full">
                <div>
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <div className="w-5 h-5 bg-white rounded-sm" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg leading-none">Vaultec</p>
                            <p className="text-gray-400 text-xs">IT Infrastructure</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <button
                            onClick={() => router.push('/activos')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => router.push('/activos')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition"
                        >
                            <Monitor className="w-5 h-5" />
                            Assets
                        </button>
                        {session?.user?.rol === 'ADMIN' && (
                            <button
                                onClick={() => router.push('/usuarios')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition"
                            >
                                <Users className="w-5 h-5" />
                                Usuarios
                            </button>
                        )}
                    </nav>
                </div>

                <div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition mb-4"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar sesión
                    </button>
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                            {session?.user?.nombre?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium leading-none">{session?.user?.nombre}</p>
                            <p className="text-gray-400 text-xs mt-1">{session?.user?.rol}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="ml-64 flex-1 p-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Hola, {session?.user?.nombre?.split(' ')[0]} 👋
                        </h1>
                        <p className="text-gray-500 text-sm capitalize mt-1">{fecha}</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Total Activos</p>
                        <p className="text-4xl font-bold text-gray-900">{total}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-green-500 uppercase tracking-wide mb-3">Activos</p>
                        <p className="text-4xl font-bold text-gray-900">{activos_}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-yellow-500 uppercase tracking-wide mb-3">En Mantenimiento</p>
                        <p className="text-4xl font-bold text-gray-900">{mantenimiento}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Dados de Baja</p>
                        <p className="text-4xl font-bold text-gray-900">{dadosBaja}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <h2 className="font-semibold text-gray-900">Activos Recientes</h2>
                            <p className="text-xs text-gray-400 mt-1">Últimas actualizaciones registradas</p>
                        </div>
                        <button
                            onClick={() => { setActivoEditar(null); setMostrarForm(!mostrarForm) }}
                            className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            {mostrarForm ? 'Cerrar' : 'Ver Todo'}
                        </button>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {['ID Activo', 'Nombre/Modelo', 'Responsable', 'Estado', 'Acción'].map(h => (
                                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {activos.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-blue-600 font-mono text-xs font-medium">
                                        #{String(a.id).padStart(4, '0')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{a.nombre}</p>
                                        <p className="text-xs text-gray-400">{a.tipo}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{a.responsable}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${ESTADO_DOT[a.estado] || 'bg-gray-400'}`} />
                                            <span className={`text-xs font-medium uppercase ${ESTADO_COLORS[a.estado] || 'text-gray-400'}`}>
                                                {a.estado}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => router.push(`/activos/${a.id}`)}
                                                className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                                            >
                                                Ver detalle
                                            </button>
                                            <button
                                                onClick={() => handleEditar(a)}
                                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(a.id)}
                                                className="text-red-500 hover:text-red-700 text-xs font-medium"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {activos.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <p className="text-4xl mb-3">📦</p>
                            <p className="text-lg font-medium">No hay activos registrados</p>
                            <p className="text-sm">Crea el primero usando el botón +</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Formulario modal */}
            {mostrarForm && (
                <ActivoForm
                    onGuardado={handleGuardado}
                    activoEditar={activoEditar}
                    onCancelar={handleCancelar}
                />
            )}

            {/* Botón flotante */}
            <button
                onClick={() => { setActivoEditar(null); setMostrarForm(!mostrarForm) }}
                className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
                <Plus className="w-6 h-6" />
            </button>

        </div>
    )
}