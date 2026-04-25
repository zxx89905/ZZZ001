/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styled from "styled-components";
import Album from "./Album";
import { albumData } from "./albumData";

const Container = styled.div`
    width: 78%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
    gap: 15px;

    @media (max-width: 650px) {
        display: flex;
        overflow-x: scroll;
    }
`;

function Grid({ onclick }) {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const list = albumData.map((item) => ({
            id: item.id,
            title: "Album",
            artist: "Artist",
            cover: item.coverImage,
        }));
        setAlbums(list);
    }, []);

    return (
        <Container>
            {albums.map((album) => (
                <Album
                    key={album.id}
                    onClick={() => onclick(album.cover)}
                    cover={album.cover}
                    title={album.title}
                    artist={album.artist}
                />
            ))}
        </Container>
    );
}

export default Grid;