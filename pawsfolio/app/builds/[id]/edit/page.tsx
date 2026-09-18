import { notFound } from 'next/navigation'
import { BuildForm } from '@/components/build-form'
import { requireUser } from '@/lib/auth'
import { getBuild } from '@/lib/db'

export default async function EditBuildPage({ params }: PageProps<'/builds/[id]/edit'>) {
  const { id } = await params
  const user = await requireUser(`/builds/${id}/edit`)
  const build = getBuild(id, user.id)
  if (!build || build.authorId !== user.id) notFound() // only the owner can edit
  return <BuildForm existing={build} />
}
