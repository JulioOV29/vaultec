'use client'
import { useState, useEffect } from 'react'
import { X, Save, ClipboardList } from 'lucide-react'

const TIPOS = ['Computador', 'Celular', 'Impresora', 'Dispositivo de red', 'Otro']
const ESTADOS = ['Activo', 'En mantenimiento', 'Dañado', 'Dado de baja']

export default function ActivoForm({ onGuardado, activoEditar, onCancelar }) {
    const [form, setForm] = useState({
        nombre: activoEditar?.nombre || '',
        tipo: activoEditar?.tipo || '',
        serial: activoEditar?.serial || '',
        fechaCompra: activoEditar?.fechaCompra?.slice(0, 10) || '',
        estado: activoEditar?.estado || 'Activo',
        responsable: activoEditar?.responsable || '',
    })
    const [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        fetch('/api/usuarios')
            .then(res => res.json())
            .then(data => setUsuarios(data))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = activoEditar ? `/api/activos/${activoEditar.id}` : '/api/activos'
        const method = activoEditar ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })

        if (res.ok) {
            onGuardado()
        } else {
            const data = await res.json()
            alert(data.error || 'Error al guardar')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <ClipboardList className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {activoEditar ? 'Editar Activo' : 'Nuevo Activo'}
                            </h2>
                            <p className="text-sm text-gray-400">
                                Complete la información para registrar un nuevo recurso técnico.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCancelar}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-5">

                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                            <input
                                name="nombre"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: MacBook Pro 16"
                            />
                        </div>

                        {/* Tipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                            <select
                                name="tipo"
                                value={form.tipo}
                                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar tipo</option>
                                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        {/* Serial */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Número Serial</label>
                            <input
                                name="serial"
                                value={form.serial}
                                onChange={(e) => setForm({ ...form, serial: e.target.value })}
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="SN-000-000-000"
                            />
                        </div>

                        {/* Fecha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Compra</label>
                            <input
                                type="date"
                                name="fechaCompra"
                                value={form.fechaCompra}
                                onChange={(e) => setForm({ ...form, fechaCompra: e.target.value })}
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                    </div>

                    {/* Estado — botones */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <div className="flex gap-2 flex-wrap">
                            {ESTADOS.map(e => (
                                <button
                                    key={e}
                                    type="button"
                                    onClick={() => setForm({ ...form, estado: e })}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${form.estado === e
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Responsable */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
                        <select
                            name="responsable"
                            value={form.responsable}
                            onChange={(e) => setForm({ ...form, responsable: e.target.value })}
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Nombre del empleado</option>
                            {usuarios.map(u => (
                                <option key={u.id} value={u.nombre}>{u.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onCancelar}
                            className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {activoEditar ? 'Guardar cambios' : 'Guardar Activo'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}