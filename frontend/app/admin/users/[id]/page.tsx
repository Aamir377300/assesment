import UserProfile from '@/components/UserProfile'

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return <UserProfile userId={params.id} />
}
