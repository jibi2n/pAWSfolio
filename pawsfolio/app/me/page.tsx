import { PostGrid } from '@/components/post-card'
import { EmptyState } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { getBuilds } from '@/lib/db'

export default async function MyBuildsPage() {
  const user = await requireUser('/me')
  const mine = getBuilds(user.id).filter(b => b.authorId === user.id)
  return (
    <div className="px-4 md:px-8 lg:px-12 pt-28 md:pt-32 pb-20">
      <h1 className="text-[26px] sm:text-[32px] font-semibold text-text mb-6 sm:mb-8">My builds</h1>
      {mine.length ? <PostGrid builds={mine} /> : <EmptyState text="You haven't shared a build yet. Show us what you made!" />}
    </div>
  )
}
