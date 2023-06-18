import ProfileComponentPrivate from '@Components/ui/ProfileComponentPrivate'

export function Profile(): JSX.Element {
  const name = 'My Profile'
  return (
    <>
      <h1>{name}</h1>
      <ProfileComponentPrivate />
    </>
  )
}
