'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
        <main className="max-w-5xl mx-auto px-6 py-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Bienvenido, {session?.user?.nombre} —{' '}
                        <span className="text-blue-600 font-medium">{session?.user?.rol}</span>
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => router.push('/activos')}
                        className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                        ← Activos
                    </button>
                    <button
                        onClick={() => setMostrarForm(!mostrarForm)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                        {mostrarForm ? 'Cerrar' : '+ Nuevo Usuario'}
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
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Nuevo Usuario</h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="juan@vaultec.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select
                                value={form.rol}
                                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                        Crear usuario
                    </button>
                </form>
            )}

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {['#', 'Nombre', 'Email', 'Rol', 'Creado', 'Acciones'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {usuarios.map((u, i) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                                <td className="px-4 py-3 font-medium text-gray-800">{u.nombre}</td>
                                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.rol === 'ADMIN'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {u.rol}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {new Date(u.creadoEn).toLocaleDateString('es-CO')}
                                </td>
                                <td className="px-4 py-3">
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
            </div>

        </main>
    )
}