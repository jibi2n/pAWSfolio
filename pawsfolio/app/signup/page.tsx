import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { getCurrentUser, safeNext } from '@/lib/auth'

export default async function SignupPage({ searchParams }: PageProps<'/signup'>) {
  const { next } = await searchParams
  const target = safeNext(next)
  if (await getCurrentUser()) redirect(target) // already logged in
  return <AuthForm mode="signup" next={target} />
}
