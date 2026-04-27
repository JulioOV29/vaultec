'use client'
import { useState } from 'react'

const TIPOS = ['Computador', 'Celular', 'Impresora', 'Dispositivo de red', 'Otro']
const ESTADOS = ['Activo', 'En mantenimiento', 'Dañado', 'Dado de baja']

export default function ActivoForm({ onGuardado, activoEditar, onCancelar }) {
    const [form, setForm] = useState({
        nombre: activoEditar?.nombre || '',
        tipo: activoEditar?.tipo || '',
        serial: activoEditar?.serial || '',
        fechaCompra: activoEditar?.fechaCompra?.slice(0, 10) || '',
        estado: activoEditar?.estado || '',
        responsable: activoEditar?.responsable || '',
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = activoEditar
            ? `/api/activos/${activoEditar.id}`
            : '/api/activos'
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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">
                {activoEditar ? 'Editar Activo' : 'Nuevo Activo'}
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Laptop Dell"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccionar tipo</option>
                        {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial</label>
                    <input
                        name="serial"
                        value={form.serial}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: SN-001234"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Compra</label>
                    <input
                        type="date"
                        name="fechaCompra"
                        value={form.fechaCompra}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccionar estado</option>
                        {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                    <input
                        name="responsable"
                        value={form.responsable}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Juan Pérez"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                    {activoEditar ? 'Guardar cambios' : 'Crear activo'}
                </button>
                {activoEditar && (
                    <button
                        type="button"
                        onClick={onCancelar}
                        className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    )
}