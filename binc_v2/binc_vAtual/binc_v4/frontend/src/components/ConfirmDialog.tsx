import { AlertTriangle, CheckCircle, X } from 'lucide-react'
import { useState } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 animate-slide-up">
        <div className="p-6 text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
            <AlertTriangle size={28} className={danger ? 'text-red-500' : 'text-amber-500'} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onCancel} className="btn-secondary flex-1 justify-center">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 justify-center px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors flex items-center gap-2 ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-600'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

interface AlertDialogProps {
  open: boolean
  title: string
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export function AlertDialog({ open, title, message, type = 'info', onClose }: AlertDialogProps) {
  if (!open) return null
  const colors = {
    success: { bg: 'bg-emerald-50', icon: 'text-emerald-500' },
    error: { bg: 'bg-red-50', icon: 'text-red-500' },
    info: { bg: 'bg-blue-50', icon: 'text-blue-500' },
  }[type]

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 animate-slide-up">
        <div className="p-6 text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${colors.bg}`}>
            <CheckCircle size={28} className={colors.icon} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="btn-primary w-full justify-center">OK</button>
        </div>
      </div>
    </div>
  )
}
