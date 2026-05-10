'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import TaskForm from '@/components/TaskForm';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { tasksApi } from '@/lib/api';
import { TaskResponse, TaskRequest } from '@/types';

export default function TasksPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState<TaskResponse | null>(null);
  const [deleteTask, setDeleteTask] = useState<TaskResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await tasksApi.getAll(token);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (data: TaskRequest) => {
    if (!token) return;
    await tasksApi.create(data, token);
    setShowCreate(false);
    fetchTasks();
  };

  const handleEdit = async (data: TaskRequest) => {
    if (!token || !editTask) return;
    await tasksApi.update(editTask.id, data, token);
    setEditTask(null);
    fetchTasks();
  };

  const handleDelete = async () => {
    if (!token || !deleteTask) return;
    setDeleting(true);
    try {
      await tasksApi.delete(deleteTask.id, token);
      setDeleteTask(null);
      fetchTasks();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Tareas</h1>
            <p className="text-sm text-gray-500 mt-0.5">{tasks.length} tareas en total</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + Nueva tarea
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-sm text-gray-400">Cargando tareas...</div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-base font-medium text-gray-900">Sin tareas aún</p>
            <p className="text-sm text-gray-500 mt-1">Crea tu primera tarea para comenzar</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
            >
              + Nueva tarea
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Entrega</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{task.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString('es-MX', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditTask(task)}
                          className="text-xs text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteTask(task)}
                          className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
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
        )}
      </div>

      {showCreate && (
        <Modal title="Nueva tarea" onClose={() => setShowCreate(false)}>
          <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}

      {editTask && (
        <Modal title="Editar tarea" onClose={() => setEditTask(null)}>
          <TaskForm initial={editTask} onSubmit={handleEdit} onCancel={() => setEditTask(null)} />
        </Modal>
      )}

      {deleteTask && (
        <Modal title="Eliminar tarea" onClose={() => setDeleteTask(null)}>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              ¿Estás seguro de que quieres eliminar{' '}
              <span className="font-medium text-gray-900">{deleteTask.title}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTask(null)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
