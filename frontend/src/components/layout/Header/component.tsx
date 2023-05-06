import { Typography } from 'antd'
import { HeaderContainer, PunchoutText } from './style'
import defaultTheme from '@data/Style'

export const Header = (): JSX.Element => {
  return (
    <HeaderContainer>
      <Typography.Title style={{ margin: 0, fontSize: '48px' }}>
        Spotify Feed
      </Typography.Title>
      <PunchoutText
        background={defaultTheme.colors.mutedKhakiColorPalette.khakiLight}
      >
        This background is passed through props in a styled component
      </PunchoutText>
    </HeaderContainer>
  )
}
