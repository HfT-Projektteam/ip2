const buttonTheme = {
  widths: {
    width50: '50%',
    width100: '100%',
  },
  border: {},
  colors: {},
}

const mutedKhakiColorPalette = {
  grey: '#e2e2e2',
  khakiLight: '#e2ded0',
  khakiDark: '#c8c09e',
  green: '#8f9d73',
  red: '#d88d71',
}

const typography = {
  primaryBlack: '#333333',
}

const header = {
  backgorundLight: '#ede8e6',
  backgroundDark: '#60694e',
}

const defaultTheme = {
  colors: {
    primary100: '#fffff',
    primary200: '#fff00',
    mutedKhakiColorPalette,
    typography,
    header,
  },
  button: { buttonTheme },
}
export default defaultTheme
