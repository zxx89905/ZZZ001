import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar/Navbar';
import { useState, useEffect } from 'react';
import styled from "styled-components";
import Loading from './components/Loading';
import Footer from './components/Footer';
import PosterEditor from './components/PosterEditor/PosterEditor'

const SIZE_PRESETS = [
  { key: "A尺寸", label: "A尺寸 (2480x3508)", width: 2480, height: 3508 },
  { key: "2-3", label: "2:3 (2700x4050)", width: 2700, height: 4050 },
];

const ContentContainer = styled.div`
  padding-top: 80px;
  min-height: calc(100vh - 80px); 
`;

function App() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const [sizeKey, setSizeKey] = useState("A尺寸");
  const size = SIZE_PRESETS.find(s => s.key === sizeKey) || SIZE_PRESETS[0];
  const selectedCover = "/default-cover.png";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? <Loading /> : (
        <>
          <Navbar />
          <ContentContainer>
            <PosterEditor
              outerCover={selectedCover}
              posterWidth={size.width}
              posterHeight={size.height}
              posterRatio={sizeKey}
              sizeKey={sizeKey}
              setSizeKey={setSizeKey}
              SIZE_PRESETS={SIZE_PRESETS}
            />
          </ContentContainer>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;