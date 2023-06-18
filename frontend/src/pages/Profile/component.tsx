import ProfileComponentPublic from '@Components/ui/ProfileComponentPublic'

export function Profile(): JSX.Element {
  const name = 'My Profile'
  return (
    <>
      <h1>{name}</h1>
      <ProfileComponentPublic />
    </>
  )
}
