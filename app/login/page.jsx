'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const res = await signIn('credentials', {
            email: form.email,
            password: form.password,
            redirect: false
        })

        if (res?.error) {
            setError('Correo o contraseña incorrectos')
            setLoading(false)
        } else {
            router.push('/activos')
        }
    }

    return (
        <main className="min-h-screen flex">

            {/* Panel izquierdo — azul */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 flex-col justify-between p-12 relative overflow-hidden">

                {/* Círculos decorativos */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

                {/* Logo */}
                <div className="flex items-center gap-3 z-10">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <div className="w-6 h-6 bg-white rounded-sm" />
                    </div>
                    <span className="text-white text-xl font-bold">Vaultec</span>
                </div>

                {/* Texto central */}
                <div className="z-10">
                    <h1 className="text-white text-5xl font-bold leading-tight mb-6">
                        Controla cada activo, en un solo lugar
                    </h1>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        La plataforma definitiva para la gestión de infraestructura IT y ciclos de vida de hardware corporativo.
                    </p>
                </div>

                {/* Stats */}
                <div className="flex gap-12 z-10">
                    <div>
                        <p className="text-white text-2xl font-bold">12k+</p>
                        <p className="text-blue-200 text-xs tracking-widest uppercase">Activos gestionados</p>
                    </div>
                    <div className="border-l border-blue-400 pl-12">
                        <p className="text-white text-2xl font-bold">99.9%</p>
                        <p className="text-blue-200 text-xs tracking-widest uppercase">Uptime reportado</p>
                    </div>
                </div>
            </div>

            {/* Panel derecho — formulario */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-12">

                <div />

                {/* Formulario */}
                <div className="max-w-md w-full mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de nuevo</h2>
                    <p className="text-gray-500 mb-8">Ingresa tus credenciales para acceder al panel de administración.</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="admin@empresa.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Ingresando...' : (
                                <>
                                    Iniciar sesión
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-6 text-sm text-gray-400">
                    <span className="cursor-pointer hover:text-gray-600">Términos</span>
                    <span className="cursor-pointer hover:text-gray-600">Privacidad</span>
                    <span className="cursor-pointer hover:text-gray-600">Ayuda</span>
                </div>

            </div>
        </main>
    )
}