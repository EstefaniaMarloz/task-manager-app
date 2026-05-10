'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { tasksApi } from '@/lib/api';
import { TaskResponse } from '@/types';

interface StatCardProps {
  label: string;
  value: number;
  accent?: string;
}

function StatCard({ label, value, accent = 'bg-gray-50' }: StatCardProps) {
  return (
    <div className={`${accent} rounded-xl border border-gray-100 px-6 py-5`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#e5e7eb',
  IN_PROGRESS: '#93c5fd',
  COMPLETED: '#86efac',
  CANCELLED: '#fca5a5',
};

export default function DashboardPage() {
  const { token, username } = useAuth();
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await tasksApi.getAll(token);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const todo = tasks.filter((t) => t.status === 'PENDING').length;
  const cancelled = tasks.filter((t) => t.status === 'CANCELLED').length;

  const chartData = [
    { status: STATUS_LABELS['PENDING'], count: todo, fill: STATUS_COLORS['PENDING'] },
    { status: STATUS_LABELS['IN_PROGRESS'], count: inProgress, fill: STATUS_COLORS['IN_PROGRESS'] },
    { status: STATUS_LABELS['COMPLETED'], count: done, fill: STATUS_COLORS['COMPLETED'] },
    { status: STATUS_LABELS['CANCELLED'], count: cancelled, fill: STATUS_COLORS['CANCELLED'] },
  ];

  const priorityData = ['HIGH', 'MEDIUM', 'LOW'].map((p) => ({
    priority: p === 'HIGH' ? 'Alta' : p === 'MEDIUM' ? 'Media' : 'Baja',
    count: tasks.filter((t) => t.priority === p).length,
  }));

  return (
    <AppLayout>
      <div className="px-8 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Bienvenido, {username}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Aquí tienes un resumen de tus tareas
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-sm text-gray-400">Cargando estadísticas...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total de tareas" value={total} />
              <StatCard label="Pendientes" value={todo} accent="bg-white" />
              <StatCard label="En progreso" value={inProgress} accent="bg-blue-50" />
              <StatCard label="Completadas" value={done} accent="bg-green-50" />
            </div>
            {cancelled > 0 && (
              <div className="grid grid-cols-1 gap-4 mb-8">
                <StatCard label="Canceladas" value={cancelled} accent="bg-red-50" />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-1">Tareas por estado</h2>
                <p className="text-xs text-gray-400 mb-6">Distribución actual de tus tareas</p>
                {total === 0 ? (
                  <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                    Sin datos disponibles
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis
                        dataKey="status"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          border: '1px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 12,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        }}
                        cursor={{ fill: '#f9fafb' }}
                      />
                      <Bar dataKey="count" name="Tareas" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-1">Tareas por prioridad</h2>
                <p className="text-xs text-gray-400 mb-6">Nivel de urgencia de tus tareas</p>
                {total === 0 ? (
                  <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                    Sin datos disponibles
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={priorityData} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis
                        dataKey="priority"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          border: '1px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 12,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        }}
                        cursor={{ fill: '#f9fafb' }}
                      />
                      <Bar dataKey="count" name="Tareas" fill="#1f2937" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {total > 0 && (
              <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Progreso general</h2>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${total > 0 ? Math.round((done / total) * 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-10 text-right">
                    {total > 0 ? Math.round((done / total) * 100) : 0}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {done} de {total} tareas completadas
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
