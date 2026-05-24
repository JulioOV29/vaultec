'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Monitor, Users, LogOut, X, Save, UserPlus } from 'lucide-react'

export default function UsuariosPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [usuarios, setUsuarios] = useState([])
    const [mostrarForm, setMostrarForm] = useState(false)
    const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'USER' })
    const [error, setError] = useState('')

    const cargarUsuarios = async () => {
        const res = await fetch('/api/usuarios')
        const data = await res.json()
        setUsuarios(data)
    }

    useEffect(() => {
        if (session?.user?.rol !== 'ADMIN') {
            router.push('/activos')
            return
        }
        cargarUsuarios()
    }, [session])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const res = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
        if (res.ok) {
            setForm({ nombre: '', email: '', password: '', rol: 'USER' })
            setMostrarForm(false)
            cargarUsuarios()
        } else {
            const data = await res.json()
            setError(data.error || 'Error al crear usuario')
        }
    }

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este usuario?')) return
        await fetch(`/api/usuarios/${id}`, { method: 'DELETE' })
        cargarUsuarios()
    }

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 flex flex-col justify-between py-6 px-4 fixed h-full">
                <div>
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <div className="w-5 h-5 bg-white rounded-sm" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg leading-none">Vaultec</p>
                            <p className="text-gray-400 text-xs">IT Infrastructure</p>
                        </div>
                    </div>

                    {/* Nav */}
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
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition"
                        >
                            <Monitor className="w-5 h-5" />
                            Assets
                        </button>

                        <button
                            onClick={() => router.push('/usuarios')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium"
                        >
                            <Users className="w-5 h-5" />
                            Usuarios
                        </button>
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

            {/* Contenido principal */}
            <main className="ml-64 flex-1 p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                        <p className="text-gray-500 text-sm mt-1">Administra los accesos al sistema</p>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <h2 className="font-semibold text-gray-900">Usuarios registrados</h2>
                            <p className="text-xs text-gray-400 mt-1">{usuarios.length} usuarios en el sistema</p>
                        </div>
                        <button
                            onClick={() => setMostrarForm(true)}
                            className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            + Nuevo Usuario
                        </button>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {['#', 'Nombre', 'Email', 'Rol', 'Creado', 'Acción'].map(h => (
                                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {usuarios.map((u, i) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-gray-400 text-xs">{i + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{u.nombre}</td>
                                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.rol === 'ADMIN'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {u.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">
                                        {new Date(u.creadoEn).toLocaleDateString('es-CO')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleEliminar(u.id)}
                                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {usuarios.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <p className="text-4xl mb-3">👥</p>
                            <p className="text-lg font-medium">No hay usuarios registrados</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal nuevo usuario */}
            {mostrarForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

                        <div className="flex items-start justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <UserPlus className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Nuevo Usuario</h2>
                                    <p className="text-sm text-gray-400">Crea un acceso al sistema</p>
                                </div>
                            </div>
                            <button onClick={() => setMostrarForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                <input
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Juan Pérez"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="juan@vaultec.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                                <div className="flex gap-2">
                                    {['USER', 'ADMIN'].map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setForm({ ...form, rol: r })}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${form.rol === r
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
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
                                    Crear usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}