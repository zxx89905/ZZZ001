/* eslint-disable react/prop-types */
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
`;

const Cover = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 10px;
    object-fit: cover;
`;

const Title = styled.h3`
    margin: 10px 0 0;
    font-size: 1em;
    opacity: 0.8;
`;

const Artist = styled.p`
    margin: 5px 0 0;
    font-size: 0.8em;
    opacity: 0.5;
`;

function Album({ cover, title, artist, onClick }) {
    return (
        <Container onClick={onClick}>
            <Cover src={cover} alt={title} />
            <Title>{title}</Title>
            <Artist>{artist}</Artist>
        </Container>
    );
}

export default Album;