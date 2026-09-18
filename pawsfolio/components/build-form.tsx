'use client'

import { startTransition, useActionState, useRef, useState } from 'react'
import Link from 'next/link'
import { saveBuild, type BuildFormState } from '@/app/actions'
import { AWS_SERVICE_TAGS, type Build, type Status } from '@/lib/types'
import { CloudBg, Tag, btn } from './ui'

const STATUSES: [Status, string][] = [['live', 'Live'], ['in-progress', 'In progress'], ['archived', 'Archived']]

function Field({ label, htmlFor, required, error, children }: { label: string; htmlFor?: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[14px] font-semibold text-text">
        {label}{required && <span className="text-vibrant-purple ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[13px] text-[#E11D48]" role="alert">{error}</p>}
    </div>
  )
}

export function BuildForm({ existing }: { existing?: Build }) {
  const [state, action, pending] = useActionState<BuildFormState, FormData>(saveBuild, {})
  const errors = state.errors ?? {}
  const [tags, setTags] = useState<string[]>(existing?.tags ?? [])
  const [status, setStatus] = useState<Status>(existing?.status ?? 'live')
  const [imagePreview, setImagePreview] = useState<string | null>(existing?.imageUrl ?? null)
  const fileRef = useRef<HTMLInputElement>(null)
  const cancelHref = existing ? `/builds/${existing.id}` : '/'

  function toggleTag(t: string) {
    setTags(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]))
  }

  function clearImage() {
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  // Submit manually instead of <form action>: React resets forms after an action, which would drop the chosen file on a validation error.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(() => action(fd))
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="absolute top-0 left-[-60px] opacity-25 pointer-events-none" aria-hidden>
        <CloudBg className="w-[320px]" />
      </div>
      <div className="absolute top-0 right-[-60px] opacity-20 pointer-events-none scale-x-[-1]" aria-hidden>
        <CloudBg className="w-[300px]" />
      </div>

      <div className="max-w-[640px] mx-auto px-4 sm:px-8 pt-24 sm:pt-28 pb-20">
        <div className="p-6 sm:p-10 bg-white rounded-hero shadow-[0_8px_40px_rgba(46,26,95,0.10)]">
          <h1 className="text-[24px] sm:text-[28px] font-semibold text-text mb-6 sm:mb-8">{existing ? 'Edit build' : 'Post a build'}</h1>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            {existing && <input type="hidden" name="id" value={existing.id} />}
            <input type="hidden" name="status" value={status} />
            {tags.map(t => <input key={t} type="hidden" name="tags" value={t} />)}

            <Field label="Title" htmlFor="title" required error={errors.title}>
              <input id="title" name="title" type="text" defaultValue={existing?.title} placeholder="e.g. Serverless Attendance Tracker" className="input" aria-invalid={!!errors.title} />
            </Field>

            <Field label="Link" htmlFor="link" error={errors.link}>
              <input id="link" name="link" type="url" defaultValue={existing?.link} placeholder="GitHub repo or live site" className="input" aria-invalid={!!errors.link} />
            </Field>

            <Field label="Image or GIF" required error={errors.image}>
              <input
                ref={fileRef}
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setImagePreview(URL.createObjectURL(f)) }}
              />
              {imagePreview ? (
                <div className="relative rounded-tag overflow-hidden aspect-[16/10] bg-lavender-bg">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button type="button" onClick={() => fileRef.current?.click()} className="px-3 h-8 rounded-full text-[13px] font-medium bg-[rgba(15,23,42,0.7)] text-white">
                      Replace
                    </button>
                    {!existing && (
                      <button type="button" onClick={clearImage} className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(15,23,42,0.7)] text-white" aria-label="Remove image">
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="upload-zone flex flex-col items-center justify-center gap-3 py-10 cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                  <span className="text-center">
                    <span className="block text-[14px] font-medium text-text">Drop an image or GIF, or browse</span>
                    <span className="block text-[12px] text-muted">PNG, JPG, GIF, WebP up to 10MB</span>
                  </span>
                </button>
              )}
            </Field>

            <Field label="Description" htmlFor="description" required error={errors.description}>
              <textarea
                id="description"
                name="description"
                defaultValue={existing?.description}
                placeholder="What did you build? How does it work? What AWS services did you use?"
                className="input h-[120px] py-3"
                aria-invalid={!!errors.description}
              />
            </Field>

            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-semibold text-text">AWS services</span>
              <div className="flex flex-wrap gap-2">
                {AWS_SERVICE_TAGS.map(t => <Tag key={t} label={t} active={tags.includes(t)} onClick={() => toggleTag(t)} />)}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-semibold text-text">Status</span>
              <div className="flex rounded-tag overflow-hidden border border-lavender-bg">
                {STATUSES.map(([s, label]) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    aria-pressed={status === s}
                    className={`seg-btn font-mono flex-1 py-2.5 text-[13px] font-medium ${status === s ? 'active' : 'text-[#64748B] bg-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={pending} className={`${btn('primary')} flex-1`}>
                {pending ? 'Saving...' : existing ? 'Save changes' : 'Publish build'}
              </button>
              <Link href={cancelHref} className={btn('tertiary')}>Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
