import styled from 'styled-components'

export const PunchoutText = styled.div.attrs(
  (props: { background: string }) => props,
)`
  display: inline-block;
  background: ${(props) => props.background};
  color: green;
  font-size: 18px;
  font-weight: bold;
  // transform: translate(50%, -70%) rotate(-4deg);
  /* Position text in the middle */
`

export const HeaderContainer = styled.div`
  padding: 20px;
  text-align: center;
`
