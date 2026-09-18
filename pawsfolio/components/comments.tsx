import Link from 'next/link'
import { addComment, deleteComment } from '@/app/actions'
import type { Build, PublicUser } from '@/lib/types'
import { Avatar, btn } from './ui'

export function Comments({ build, user }: { build: Build; user: PublicUser | null }) {
  const isPostOwner = user?.id === build.authorId

  return (
    <section>
      <h2 className="text-[20px] font-medium text-text mb-6">Comments ({build.comments.length})</h2>

      {user ? (
        // A server-action form: React clears the textarea after it posts.
        <form action={addComment.bind(null, build.id)} className="flex gap-3 mb-6">
          <Avatar name={user.name} color={user.avatarColor} size={36} />
          <div className="flex-1 flex flex-col gap-2">
            <textarea name="text" required placeholder="Add a comment..." aria-label="Add a comment" className="input h-20 py-3" />
            <div className="flex justify-end">
              <button type="submit" className={btn('primary', 'sm')}>Comment</button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mb-6 p-4 rounded-btn bg-white text-[14px] text-[#64748B]">
          <Link href={`/login?next=/builds/${build.id}`} className="text-vibrant-purple font-medium">Log in</Link> to join the conversation.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {build.comments.map(c => {
          // Commenters can delete their own comments; post owners can delete any comment on their post.
          const canDelete = !!user && (c.authorId === user.id || isPostOwner)
          return (
            <div key={c.id} className="p-4 flex gap-3 bg-white rounded-btn shadow-[0_2px_8px_rgba(46,26,95,0.06)]">
              <Avatar name={c.author} color={c.avatarColor} size={34} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[14px] font-semibold text-text">{c.handle}</span>
                  {c.authorId === build.authorId && (
                    <span className="font-mono px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(74,222,184,0.2)] text-[#0F766E]">Builder</span>
                  )}
                  <span className="font-mono text-[12px] text-muted">{c.timeAgo}</span>
                </div>
                <p className="text-[14px] text-text leading-relaxed whitespace-pre-line">{c.text}</p>
                {canDelete && (
                  <form action={deleteComment.bind(null, build.id, c.id)}>
                    <button
                      type="submit"
                      className="mt-1.5 text-[12px] text-muted hover:text-[#E11D48] transition-colors"
                      aria-label={`Delete comment by ${c.handle}`}
                    >
                      Delete
                    </button>
                  </form>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
