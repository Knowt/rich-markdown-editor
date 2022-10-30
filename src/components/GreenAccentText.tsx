import styled from 'styled-components';

/* TYPES */
interface Attrs {
    fontSize?: number;
}

const GreenAccentText = styled.span.attrs<Attrs>(
    ( { fontSize=12 } ) => ( {
        style: {
            fontSize: `${fontSize}px`,
        },
    } )
)`
    font-size: 12px;
    font-weight: 600;
    padding: 4px 6px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: ${(props) => props.theme.knowtGreen};
    background-color: ${(props) => props.theme.blockToolbarTagBackgroundColor};
`;

export default GreenAccentText;