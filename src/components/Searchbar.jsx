/* eslint-disable react/prop-types */
import styled from 'styled-components';

const Container = styled.div`
    display: none; /* 直接隐藏搜索框 */
`;

function Searchbar() {
    return <Container />;
}

export default Searchbar;