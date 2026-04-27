'use client'

const ESTADO_COLORS = {
    'Activo': 'bg-green-100 text-green-700',
    'En mantenimiento': 'bg-yellow-100 text-yellow-700',
    'Dañado': 'bg-red-100 text-red-700',
    'Dado de baja': 'bg-gray-100 text-gray-600',
}

export default function ActivoTable({ activos, onEditar, onEliminar }) {
    if (!activos.length) return (
        <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-lg font-medium">No hay activos registrados</p>
            <p className="text-sm">Crea el primero usando el formulario de arriba</p>
        </div>
    )

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {['#', 'Nombre', 'Tipo', 'Serial', 'Fecha Compra', 'Estado', 'Responsable', 'Acciones'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {activos.map((a, i) => (
                        <tr key={a.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                            <td className="px-4 py-3 font-medium text-gray-800">{a.nombre}</td>
                            <td className="px-4 py-3 text-gray-600">{a.tipo}</td>
                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">{a.serial}</td>
                            <td className="px-4 py-3 text-gray-500">
                                {new Date(a.fechaCompra).toLocaleDateString('es-CO')}
                            </td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADO_COLORS[a.estado] || 'bg-gray-100 text-gray-600'}`}>
                                    {a.estado}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{a.responsable}</td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEditar(a)}
                                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onEliminar(a.id)}
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
        </div>
    )
}