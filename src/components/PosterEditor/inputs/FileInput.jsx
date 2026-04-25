/* eslint-disable react/prop-types */
import styled from "styled-components";
import React from "react";
import { FaFile } from "react-icons/fa6";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px;
    cursor: pointer;
`;

const Title = styled.p`
    font-size: 1em;
    font-weight: 500;
    margin-left: 5px;
    margin-bottom: 5px;
`;

const InputBox = styled.div`
    font-size: 0.85em;
    background-color: rgba(255, 255, 255, 0.05);
    border: none;
    padding: 5px;
    border-radius: 7px;
    outline: none;
    overflow: hidden;
    display: flex;
    align-items: center;
`;

const Input = styled.input.attrs({ type: 'file' })`
    display: none;
`;

const Text = styled.p`
    font-size: 0.85em;
    font-weight: bold;
    margin-left: 10px;
    margin-block: auto;
    cursor: pointer;
    opacity: ${({ $active }) => ($active ? 1 : 0.5)};
    transition: opacity 0.3s;
    width: 100%;
    margin-right: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const IconFile = styled(FaFile)`
    width: 16px;
    height: 16px;
    margin-left: 10px;
`

const FileInput = React.forwardRef(({ title, text, onChange }, ref) => {
    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) onChange(file);
    };

    return (
        <Container onClick={() => ref.current?.click()}>
            <Title>{title}</Title>
            <InputBox>
                <IconFile />
                <Input
                    ref={ref}
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={handleChange}
                />
                <Text $active={true}>{text}</Text>
            </InputBox>
        </Container>
    );
});

export default FileInput;