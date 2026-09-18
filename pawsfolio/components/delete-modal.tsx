import { btn } from './ui'

export function DeleteModal({ onConfirm, onCancel, pending }: { onConfirm: () => void; onCancel: () => void; pending?: boolean }) {
  return (
    <div className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        className="w-full max-w-sm p-8 flex flex-col gap-5 bg-card rounded-card shadow-[0_24px_64px_rgba(46,26,95,0.25)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-btn flex items-center justify-center bg-danger-soft">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
        </div>
        <div>
          <h3 id="delete-title" className="text-[20px] font-semibold text-text mb-2">Delete this build?</h3>
          <p className="text-[14px] text-subtle leading-relaxed">Delete this build and its comments? This can&apos;t be undone.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className={`${btn('tertiary', 'sm')} flex-1`} autoFocus>Cancel</button>
          <button type="button" onClick={onConfirm} disabled={pending} className={`${btn('danger', 'sm')} flex-1`}>{pending ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  )
}
