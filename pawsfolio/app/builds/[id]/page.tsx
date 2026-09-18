import { notFound } from 'next/navigation'
import { BuildDetail } from '@/components/build-detail'
import { getCurrentUser } from '@/lib/auth'
import { getBuild } from '@/lib/db'

export default async function BuildPage({ params, searchParams }: PageProps<'/builds/[id]'>) {
  const [{ id }, { new: isNew }, user] = await Promise.all([params, searchParams, getCurrentUser()])
  const build = getBuild(id, user?.id)
  if (!build) notFound()
  return <BuildDetail build={build} user={user} isNew={isNew === '1'} />
}
