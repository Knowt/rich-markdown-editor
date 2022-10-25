import styled from 'styled-components';

const MenuItem = styled.button<{
    selected: boolean;
  }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
    font-size: 17px;
    line-height: 1;
    width: 100%;
    height: 40px;
    cursor: pointer;
    border: none;
    opacity: ${(props) => (props.disabled ? ".5" : "1")};
    color: ${(props) =>
        props.selected
        ? props.theme.blockToolbarTextSelected
        : props.theme.blockToolbarText};
    background: ${(props) =>
        props.selected
        ? props.theme.blockToolbarSelectedBackground ||
            props.theme.blockToolbarTrigger
        : "none"};
    padding: 0 16px;
    outline: none;

    &:hover,
    &:active {
        color: ${(props) => props.theme.blockToolbarTextSelected};
        background: ${(props) =>
        props.selected
            ? props.theme.blockToolbarSelectedBackground ||
            props.theme.blockToolbarTrigger
            : props.theme.blockToolbarHoverBackground};
    }
`;

export default MenuItem;