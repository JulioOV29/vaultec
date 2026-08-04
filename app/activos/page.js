'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Monitor, Users, LogOut, Plus, Menu, X } from 'lucide-react'
import ActivoForm from '@/components/ActivoForm'

export default function ActivosPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [activos, setActivos] = useState([])
    const [activoEditar, setActivoEditar] = useState(null)
    const [mostrarForm, setMostrarForm] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

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

    const Sidebar = () => (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col justify-between py-6 px-4
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
        `}>
            <div>
                {/* Logo */}
                <div className="flex items-center justify-between mb-10 px-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <div className="w-5 h-5 bg-white rounded-sm" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg leading-none">Vaultec</p>
                            <p className="text-gray-400 text-xs">IT Infrastructure</p>
                        </div>
                    </div>
                    {/* Cerrar sidebar en mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="space-y-1">
                    <button
                        onClick={() => { router.push('/activos'); setSidebarOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => { router.push('/activos'); setSidebarOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition"
                    >
                        <Monitor className="w-5 h-5" />
                        Assets
                    </button>
                    {session?.user?.rol === 'ADMIN' && (
                        <button
                            onClick={() => { router.push('/usuarios'); setSidebarOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition"
                        >
                            <Users className="w-5 h-5" />
                            Usuarios
                        </button>
                    )}
                </nav>
            </div>

            {/* User */}
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
    )

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar />

            {/* Contenido principal */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0 w-full min-w-0">

                {/* Header mobile */}
                <div className="flex items-center justify-between mb-6 lg:mb-8">
                    <div className="flex items-center gap-3">
                        {/* Hamburger */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-600 hover:text-gray-900"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Hola, {session?.user?.nombre?.split(' ')[0]} 👋
                            </h1>
                            <p className="text-gray-500 text-xs sm:text-sm capitalize mt-0.5">{fecha}</p>
                        </div>
                    </div>
                </div>

                {/* Cards métricas */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">Total</p>
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{total}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-green-500 uppercase tracking-wide mb-2 sm:mb-3">Activos</p>
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{activos_}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-yellow-500 uppercase tracking-wide mb-2 sm:mb-3 leading-tight">Mantenimiento</p>
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{mantenimiento}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 sm:mb-3 leading-tight">De Baja</p>
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{dadosBaja}</p>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
                        <div>
                            <h2 className="font-semibold text-gray-900">Activos Recientes</h2>
                            <p className="text-xs text-gray-400 mt-1 hidden sm:block">Últimas actualizaciones registradas</p>
                        </div>
                        <button
                            onClick={() => { setActivoEditar(null); setMostrarForm(!mostrarForm) }}
                            className="text-sm text-gray-600 border border-gray-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            {mostrarForm ? 'Cerrar' : 'Ver Todo'}
                        </button>
                    </div>

                    {/* Tabla desktop */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['ID', 'Nombre/Modelo', 'Responsable', 'Estado', 'Acción'].map(h => (
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
                                                <button onClick={() => router.push(`/activos/${a.id}`)} className="text-gray-500 hover:text-gray-700 text-xs font-medium">Ver</button>
                                                <button onClick={() => handleEditar(a)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Editar</button>
                                                <button onClick={() => handleEliminar(a.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards mobile */}
                    <div className="sm:hidden divide-y divide-gray-100">
                        {activos.map((a) => (
                            <div key={a.id} className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-medium text-gray-900">{a.nombre}</p>
                                        <p className="text-xs text-gray-400">{a.tipo} · #{String(a.id).padStart(4, '0')}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${ESTADO_DOT[a.estado] || 'bg-gray-400'}`} />
                                        <span className={`text-xs font-medium uppercase ${ESTADO_COLORS[a.estado] || 'text-gray-400'}`}>
                                            {a.estado}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">👤 {a.responsable}</p>
                                <div className="flex gap-3">
                                    <button onClick={() => router.push(`/activos/${a.id}`)} className="text-gray-500 text-xs font-medium">Ver detalle</button>
                                    <button onClick={() => handleEditar(a)} className="text-blue-600 text-xs font-medium">Editar</button>
                                    <button onClick={() => handleEliminar(a.id)} className="text-red-500 text-xs font-medium">Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>

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
                className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center z-30"
            >
                <Plus className="w-6 h-6" />
            </button>

        </div>
    )
}