import styled from "styled-components";

const Separator = styled.div`
  height: 65%;
  margin-block: auto;
  margin-inline: 4px;
  width: 2px;
  background: ${props => props.theme.toolbarItem};
  opacity: 0.3;
  display: inline-block;
`;

export default Separator;
