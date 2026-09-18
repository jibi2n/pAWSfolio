'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { deleteBuild } from '@/app/actions'
import { DeleteModal } from './delete-modal'
import { btn } from './ui'

/** Edit + Delete for the build's owner. Client-only because the confirm modal needs state. */
export function OwnerActions({ buildId }: { buildId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-3">
      <Link href={`/builds/${buildId}/edit`} className={btn('secondary', 'sm')}>Edit</Link>
      <button type="button" onClick={() => setConfirming(true)} className={btn('danger', 'sm')}>Delete</button>
      {confirming && (
        <DeleteModal
          pending={pending}
          onConfirm={() => startTransition(() => deleteBuild(buildId))}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  )
}
