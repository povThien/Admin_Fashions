"use client"

import Link from "next/link"

interface NutThaoTacProps {
  viewUrl?: string
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function NutThaoTac({ viewUrl, onView, onEdit, onDelete }: NutThaoTacProps) {
  return (
    <div className="flex items-center">
      {viewUrl ? (
        <Link href={viewUrl} className="text-primary hover:text-yellow-600 mr-3">
          <i className="fas fa-eye"></i>
        </Link>
      ) : onView ? (
        <button onClick={onView} className="text-primary hover:text-yellow-600 mr-3">
          <i className="fas fa-eye"></i>
        </button>
      ) : null}

      {onEdit && (
        <button onClick={onEdit} className="text-gray-500 hover:text-gray-700 mr-3">
          <i className="fas fa-edit"></i>
        </button>
      )}

      {onDelete && (
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <i className="fas fa-trash"></i>
        </button>
      )}
    </div>
  )
}
