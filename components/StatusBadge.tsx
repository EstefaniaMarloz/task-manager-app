import { TaskStatus, TaskPriority } from '@/types';

const statusStyles: Record<TaskStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-50 text-blue-700',
  COMPLETED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-500',
};

const statusLabels: Record<TaskStatus, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const priorityStyles: Record<TaskPriority, string> = {
  LOW: 'bg-gray-50 text-gray-500',
  MEDIUM: 'bg-yellow-50 text-yellow-700',
  HIGH: 'bg-orange-50 text-orange-600',
  CRITICAL: 'bg-red-50 text-red-600',
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityStyles[priority]}`}>
      {priorityLabels[priority]}
    </span>
  );
}
