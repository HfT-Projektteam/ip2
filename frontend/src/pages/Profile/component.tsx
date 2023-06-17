import ProfileComponent from '@Components/ui/ProfileComponent'

export function Profile(): JSX.Element {
  const name = 'My Profile'
  return (
    <>
      <h1>{name}</h1>
      <ProfileComponent />
    </>
  )
}
