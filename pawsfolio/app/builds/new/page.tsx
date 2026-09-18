import { BuildForm } from '@/components/build-form'
import { requireUser } from '@/lib/auth'

export default async function NewBuildPage() {
  await requireUser('/builds/new')
  return <BuildForm />
}
