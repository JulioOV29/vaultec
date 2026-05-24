'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { LayoutDashboard, Monitor, Users, LogOut, ArrowLeft, Clock, Plus, X, Save, Trash2, Pencil } from 'lucide-react'

export default function ActivoDetallePage() {
    const { data: session } = useSession()
    const router = useRouter()
    const { id } = useParams()
    const [activo, setActivo] = useState({ Mantenimiento: [] })
    const [mostrarForm, setMostrarForm] = useState(false)
    const [form, setForm] = useState({ titulo: '', descripcion: '', tecnico: '' })

    const cargarActivo = async () => {
        const res = await fetch(`/api/activos/${id}`)
        const data = await res.json()
        setActivo(data)
    }

    useEffect(() => { if (id) cargarActivo() }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch('/api/mantenimientos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activoId: id, ...form })
        })
        if (res.ok) {
            setForm({ titulo: '', descripcion: '', tecnico: '' })
            setMostrarForm(false)
            cargarActivo()
        }
    }

    const handleEliminarMantenimiento = async (mantenimientoId) => {
        if (!confirm('¿Eliminar este mantenimiento?')) return
        await fetch(`/api/mantenimientos/${mantenimientoId}`, { method: 'DELETE' })
        cargarActivo()
    }

    const ESTADO_COLORS = {
        'Activo': 'bg-green-100 text-green-700',
        'En mantenimiento': 'bg-yellow-100 text-yellow-700',
        'Dañado': 'bg-red-100 text-red-700',
        'Dado de baja': 'bg-gray-100 text-gray-600',
    }

    const ESTADO_DOT = {
        'Activo': 'bg-green-500',
        'En mantenimiento': 'bg-yellow-500',
        'Dañado': 'bg-red-500',
        'Dado de baja': 'bg-gray-400',
    }

    if (!activo.nombre) return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-gray-400">Cargando...</p>
        </div>
    )

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
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => router.push('/activos')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium"
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

            {/* Contenido */}
            <main className="ml-64 flex-1 p-8">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <button onClick={() => router.push('/activos')} className="flex items-center gap-1 hover:text-gray-600 transition">
                        <ArrowLeft className="w-4 h-4" />
                        Assets
                    </button>
                    <span>›</span>
                    <span className="text-gray-900 font-medium">{activo.nombre}</span>
                </div>

                {/* Header del activo */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activo.nombre} #{String(activo.id).padStart(4, '0')}
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${ESTADO_DOT[activo.estado]}`} />
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_COLORS[activo.estado]}`}>
                                    {activo.estado}
                                </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {activo.tipo}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/activos')}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
                        >
                            <Pencil className="w-4 h-4" />
                            Editar
                        </button>
                        <button
                            onClick={async () => {
                                if (!confirm('¿Eliminar este activo?')) return
                                await fetch(`/api/activos/${id}`, { method: 'DELETE' })
                                router.push('/activos')
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                        >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                        </button>
                    </div>
                </div>

                {/* Info del activo */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900">Información del Activo</h2>
                        <p className="text-xs text-gray-400">
                            Registrado el {new Date(activo.creadoEn).toLocaleDateString('es-CO')}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Número Serial</p>
                            <p className="text-sm font-medium text-gray-900">{activo.serial}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Fecha de Compra</p>
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(activo.fechaCompra).toLocaleDateString('es-CO')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Responsable</p>
                            <p className="text-sm font-medium text-gray-900">{activo.responsable}</p>
                        </div>
                    </div>
                </div>

                {/* Historial de mantenimientos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <h2 className="font-semibold text-gray-900">Historial de Mantenimientos</h2>
                        </div>
                        <button
                            onClick={() => setMostrarForm(true)}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                            <Plus className="w-4 h-4" />
                            Registrar Mantenimiento
                        </button>
                    </div>

                    {/* Timeline */}
                    {activo.Mantenimiento.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">Sin mantenimientos registrados</p>
                            <p className="text-sm">Registra el primero usando el botón de arriba</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activo.Mantenimiento.map((m, i) => (
                                <div key={m.id} className="flex gap-4">
                                    {/* Dot */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                        {i < activo.Mantenimiento.length - 1 && (
                                            <div className="w-0.5 bg-gray-200 flex-1 mt-1" />
                                        )}
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 pb-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-900">{m.titulo}</p>
                                                <p className="text-sm text-gray-500 mt-1">{m.descripcion}</p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    👤 {m.tecnico}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 ml-4">
                                                <p className="text-xs text-gray-400 whitespace-nowrap">
                                                    {new Date(m.fecha).toLocaleDateString('es-CO', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    }).toUpperCase()}
                                                </p>
                                                <button
                                                    onClick={() => handleEliminarMantenimiento(m.id)}
                                                    className="text-red-400 hover:text-red-600 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal nuevo mantenimiento */}
            {mostrarForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

                        <div className="flex items-start justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Nuevo Mantenimiento</h2>
                                    <p className="text-sm text-gray-400">Registra un mantenimiento para este activo</p>
                                </div>
                            </div>
                            <button onClick={() => setMostrarForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                                <input
                                    value={form.titulo}
                                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Limpieza preventiva"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    value={form.descripcion}
                                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                    required
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Describe el mantenimiento realizado..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Técnico</label>
                                <input
                                    value={form.tecnico}
                                    onChange={(e) => setForm({ ...form, tecnico: e.target.value })}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nombre del técnico"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setMostrarForm(false)}
                                    className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}