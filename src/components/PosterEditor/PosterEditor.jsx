/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import styled, { css, keyframes } from "styled-components";
import { IoArrowBack } from "react-icons/io5";
import NormalInput from "./inputs/NormalInput";
import DoubleInput from "./inputs/DoubleInput";
import ColorInput from "./inputs/ColorInput";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ColorSelector from "./ColorSelector";
import CheckInput from "./inputs/CheckInput";
import FileInput from "./inputs/FileInput";
import { IoMdDownload } from "react-icons/io";
import { MdOutlineRefresh } from "react-icons/md";
import CanvasPoster from "./CanvasPoster";
import CanvasPoster23 from "./CanvasPoster23";

// 默认封面
const DEFAULT_COVER = "/default-cover.png";

const Container = styled.div`
    width: 80%;
    margin-inline: auto;
`;

const DivBack = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: min-content;
    margin-top: 25px;
    cursor: pointer;
`;

const ArrowBack = styled(IoArrowBack)`
    font-size: 2em;
    margin-right: 5px;
    cursor: pointer;
`;

const TextBack = styled.h3`
    font-size: 1.3em;
    font-weight: bold;
`;

const ContainerEditor = styled.div`
    width: 100%;
    height: auto;
    margin-top: 15px;
    display: flex;
    flex-direction: row;

    @media (max-width: 1300px) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`;

const PosterPreview = styled.img`
    width: 388px;
    height: 548px;
    margin-right: 20px;
    object-fit: cover;

    @media (max-width: 450px) {
        width: 95%;
        margin-right: 0;
    }
`;

const EditorColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const TabsContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    width: 90%;
    margin-inline: auto;
`;

const Tab = styled.div`
    padding: 10px 20px;
    font-size: 1em;
    font-weight: 500;
    color: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.5)")};
    cursor: pointer;
    border-bottom: ${({ $active }) => ($active ? "2px solid var(--PosterfyGreen)" : "none")};
    transition: color 0.3s, border-bottom 0.3s;

    &:hover {
        color: #fff;
    }
`;

const EditorSettings = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 7px;
    padding-inline: 30px;
    width: 100%;

    @media (max-width: 1300px) {
        margin-top: 15px;
    }
    @media (max-width: 530px) {
        padding: 0;
    }
`;

const TracklistContainer = styled.div`
    padding: 20px 30px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const TracklistTextarea = styled.textarea`
    width: 100%;
    flex: 1;
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
    border: none;
    padding: 15px;
    font-size: 14px;
    resize: none;
    border-radius: 8px;
    overflow-y: auto;
    max-height: 300px;
    line-height: 1.5em;

    &:focus {
        outline: none;
        background: rgba(255, 255, 255, 255, 0.07);
    }
    @media (max-width: 530px) {
        padding: 10px;
    }
`;

const DivButtons = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 15px;
    margin-inline: -20px;
    justify-content: end;

    @media (max-width: 450px) {
        justify-content: center;
    }
    @media (max-width: 350px) {
        flex-direction: column;
    }
`;

const ButtonDiv = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 7px 15px;
    width: min-content;
    margin-left: 15px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    z-index: 1;

    ::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0);
        transition: background-color 0.5s;
        z-index: -1;
    }
    :hover::before {
        background-color: rgba(255, 255, 255, 0.1);
    }
    @media (max-width: 350px) {
        margin-inline: auto;
        margin-bottom: 20px;
        padding-inline: 50px;
    }
`;

const ButtonText = styled.p`
    font-size: 0.85em;
    margin-inline: 10px;
    font-weight: bold;
`;

const IconDownload = styled(IoMdDownload)`
    font-size: 1.15em;
`;

const IconApply = styled(MdOutlineRefresh)`
    font-size: 1.15em;
    will-change: transform;
    ${({ $spinning }) =>
        $spinning
            ? css`
                  animation: ${keyframes`
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                  `} 0.8s linear infinite;
              `
            : ""}
`;

const FakePoster = styled.div`
    width: 560px;
    height: 740px;
    background: #222;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    margin-right: 20px;

    @media (max-width: 450px) {
        width: 95%;
        margin-right: 0;
    }
`;

const ShortcutsInfo = styled.p`
    font-size: 0.75em;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 10px;
    margin-right: 20px;
    text-align: right;
    width: 100%;
    margin-left: 20px;

    @media (max-width: 450px) {
        text-align: center;
    }
`;

function PosterEditor({
    outerCover = "",
    posterWidth = 2480,
    posterHeight = 3508,
    posterRatio = "a4",
    sizeKey,
    setSizeKey,
    SIZE_PRESETS
}) {
    const { t } = useTranslation();
    const previewRef = useRef(null);
    const fileInputRef = useRef(null);
    const imgRef = useRef(null);

    // 初始默认封面
    const [albumCover, setAlbumCover] = useState(outerCover || DEFAULT_COVER);

    const [albumName, setAlbumName] = useState("专辑名称");
    const [artistsName, setArtistsName] = useState("艺术家");
    const [titleSize, setTitleSize] = useState("200");
    const [artistsSize, setArtistsSize] = useState("110");
    const [tracksSize, setTracksSize] = useState("50");
    const [marginTop, setMarginTop] = useState("");
    const [marginSide, setmarginSide] = useState(160);
    const [marginCover, setMarginCover] = useState(0);
    const [backgroundColor, setbackgroundColor] = useState("#1a1a1a");
    const [textColor, setTextColor] = useState("#ffffff");
    const [color1, setcolor1] = useState("#ff5555");
    const [color2, setcolor2] = useState("#55ff88");
    const [color3, setcolor3] = useState("#5588ff");
    const [useFade, setUseFade] = useState(true);

    // 固定：曲目列表永久开启
    const showTracklist = true;

    const [activeTab, setActiveTab] = useState("information");
    const [tracklist, setTracklist] = useState("");
    const [titleRelease, setTitleRelease] = useState("发行日期");
    const [releaseDate, setReleaseDate] = useState("2026");
    const [titleRuntime, setTitleRuntime] = useState("时长");
    const [runtime, setRuntime] = useState("00:00");

    const [showColorSelector, setShowColorSelector] = useState(false);
    const [colorInputPosition, setColorInputPosition] = useState(null);
    const [currentColorInput, setCurrentColorInput] = useState(null);

    const [userAdjustedTitleSize, setUserAdjustedTitleSize] = useState(false);
    const [initialTitleSizeSet, setInitialTitleSizeSet] = useState(false);

    const [image, setImage] = useState(null);
    const [generatePoster, setGeneratePoster] = useState(true);
    const [spinApplyButton, setSpinApplyButton] = useState(false);

    const handleTitleSizeChange = (e) => {
        setTitleSize(e.target.value);
        setUserAdjustedTitleSize(true);
    };

    const handleTitleSizeAdjust = (adjustedSize, isInitial) => {
        if (isInitial && !initialTitleSizeSet) {
            setTitleSize(adjustedSize);
            setInitialTitleSizeSet(true);
        } else if (!userAdjustedTitleSize) {
            setTitleSize(adjustedSize);
        }
    };

    const posterData = {
        albumCover,
        albumName,
        artistsName,
        titleSize,
        artistsSize,
        tracksSize,
        marginTop,
        marginSide,
        marginCover,
        titleRelease,
        releaseDate,
        titleRuntime,
        runtime,
        backgroundColor,
        textColor,
        useFade,
        showTracklist,
        tracklist,
        color1,
        color2,
        color3,
        userAdjustedTitleSize,
        initialTitleSizeSet,
    };

    const handleImageReady = (imageUrl) => {
        setImage(imageUrl);
        setGeneratePoster(false);
        setSpinApplyButton(false);
    };

    const handleApplyClick = () => {
        setUserAdjustedTitleSize(false);
        requestAnimationFrame(() => {
            setSpinApplyButton(true);
            setGeneratePoster(true);
        });
    };

    const handleFileChange = (file) => {
        const newUrl = URL.createObjectURL(file);
        setAlbumCover(newUrl);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // 封面自动取色
    const handleImgLoad = () => {
        if (!imgRef.current) return;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = imgRef.current;
        canvas.width = 50;
        canvas.height = 50;
        try {
            ctx.drawImage(img, 0, 0, 50, 50);
            const data = ctx.getImageData(25, 25, 1, 1).data;
            const r = data[0], g = data[1], b = data[2];
            const bg = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
            setbackgroundColor(bg);
        } catch (e) {}
    };

    const handleDownloadClick = () => {
        if (!image) return;
        const link = document.createElement("a");
        link.href = image;
        link.download = `Poster - ${albumName}.png`;
        link.click();
    };

    const handleCoverDownloadClick = async () => {
        if (!albumCover) return;
        const blob = await (await fetch(albumCover)).blob();
        const link = Object.assign(document.createElement("a"), {
            href: URL.createObjectURL(blob),
            download: `Cover.png`,
        });
        link.click();
        URL.revokeObjectURL(link.href);
    };

    // 原版颜色弹窗点击
    function handleColorInputClick(e, colorInputName) {
        const rect = e.target.getBoundingClientRect();
        setColorInputPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
        });
        setCurrentColorInput(colorInputName);
        setShowColorSelector(true);
    }

    // 防崩溃关闭逻辑
    function handleColorSelectorClose() {
        setShowColorSelector(false);
        setTimeout(() => {
            setColorInputPosition(null);
            setCurrentColorInput(null);
        }, 180);
    }

    useEffect(() => {
        setTitleRelease(t("EDITOR_ReleaseTitle"));
        setTitleRuntime(t("EDITOR_RuntimeTitle"));
    }, [t]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                handleApplyClick();
            } else if (event.ctrlKey && event.key === "d") {
                event.preventDefault();
                handleDownloadClick();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [image, albumName]);

    useEffect(() => {
        if (albumCover) setGeneratePoster(true);
    }, [albumCover]);

    return (
        <Container>
            <img
                ref={imgRef}
                src={albumCover}
                onLoad={handleImgLoad}
                style={{ display: "none" }}
                crossOrigin="anonymous"
            />

            <ContainerEditor>
                {posterRatio === "2-3" ? (
                    <CanvasPoster23
                        onImageReady={handleImageReady}
                        posterData={posterData}
                        generatePoster={generatePoster}
                        onTitleSizeAdjust={handleTitleSizeAdjust}
                        width={posterWidth}
                        height={posterHeight}
                    />
                ) : (
                    <CanvasPoster
                        onImageReady={handleImageReady}
                        posterData={posterData}
                        generatePoster={generatePoster}
                        onTitleSizeAdjust={handleTitleSizeAdjust}
                        width={posterWidth}
                        height={posterHeight}
                    />
                )}

                {image ? (
                    <PosterPreview src={image} ref={previewRef} />
                ) : (
                    <FakePoster ref={previewRef}>
                        {albumCover ? "生成海报中…" : "请手动上传封面"}
                    </FakePoster>
                )}

                <EditorColumn>
                    <TabsContainer>
                        <Tab $active={activeTab === "information"} onClick={() => setActiveTab("information")}>
                            {t("EDITOR_InformationTab")}
                        </Tab>
                        <Tab $active={activeTab === "tracklist"} onClick={() => setActiveTab("tracklist")}>
                            {t("EDITOR_TracklistTab")}
                        </Tab>
                    </TabsContainer>

                    {activeTab === "information" ? (
                        <EditorSettings>
                            <NormalInput title={t("EDITOR_AlbumName")} value={albumName} onChange={(e) => setAlbumName(e.target.value)} />
                            <NormalInput title={t("EDITOR_ArtistName")} value={artistsName} onChange={(e) => setArtistsName(e.target.value)} />
                            <NormalInput title={t("EDITOR_TitleSize")} value={titleSize} onChange={handleTitleSizeChange} />
                            <NormalInput title={t("EDITOR_ArtistSize")} value={artistsSize} onChange={(e) => setArtistsSize(e.target.value)} />
                            <NormalInput title={t("EDITOR_TracksSize")} value={tracksSize} onChange={(e) => setTracksSize(e.target.value)} />
                            <NormalInput title={t("EDITOR_MarginTop")} value={marginTop} onChange={(e) => setMarginTop(e.target.value)} />
                            <NormalInput title={t("EDITOR_MarginSide")} value={marginSide} onChange={(e) => setmarginSide(e.target.value)} />
                            <NormalInput title={t("EDITOR_MarginCover")} value={marginCover} onChange={(e) => setMarginCover(e.target.value)} />

                            <DoubleInput title={titleRelease} value={releaseDate} onChangeTitle={(e) => setTitleRelease(e.target.value)} onChangeDate={(e) => setReleaseDate(e.target.value)} />
                            <DoubleInput title={titleRuntime} value={runtime} onChangeTitle={(e) => setTitleRuntime(e.target.value)} onChangeDate={(e) => setRuntime(e.target.value)} />

                            <ColorInput title={t("EDITOR_BackgroundColor")} value={backgroundColor} onClick={(e) => handleColorInputClick(e, "backgroundColor")} />
                            <ColorInput title={t("EDITOR_TextColor")} value={textColor} onClick={(e) => handleColorInputClick(e, "textColor")} />
                            <ColorInput title={`${t("EDITOR_Color")} 1`} value={color1} onClick={(e) => handleColorInputClick(e, "color1")} />
                            <ColorInput title={`${t("EDITOR_Color")} 2`} value={color2} onClick={(e) => handleColorInputClick(e, "color2")} />
                            <ColorInput title={`${t("EDITOR_Color")} 3`} value={color3} onClick={(e) => handleColorInputClick(e, "color3")} />

                            <CheckInput title={t("EDITOR_Fade")} value={useFade} onChange={setUseFade} text={t("EDITOR_FadeText")} />
                            
                            {/* 上传封面 文字改为：点击上传封面 */}
                            <FileInput ref={fileInputRef} title="点击上传封面" onChange={handleFileChange} />

                            {/* 海报尺寸 放到最后 */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <label style={{ fontSize: "0.85em", color: "#aaa" }}>海报尺寸</label>
                                <select
                                    value={sizeKey}
                                    onChange={(e) => setSizeKey(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "8px 10px",
                                        borderRadius: "6px",
                                        background: "rgba(255,255,255,0.07)",
                                        border: "none",
                                        color: "#fff",
                                        outline: "none",
                                        fontSize: "0.9em"
                                    }}
                                >
                                    {SIZE_PRESETS.map(preset => (
                                        <option key={preset.key} value={preset.key} style={{ background: "#222" }}>
                                            {preset.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {showColorSelector && colorInputPosition && currentColorInput && (
                                <ColorSelector
                                    DefaultColor={
                                        currentColorInput === "backgroundColor" ? backgroundColor
                                        : currentColorInput === "textColor" ? textColor
                                        : currentColorInput === "color1" ? color1
                                        : currentColorInput === "color2" ? color2
                                        : color3
                                    }
                                    image={albumCover}
                                    onDone={(selectedColor) => {
                                        switch (currentColorInput) {
                                            case "backgroundColor": setbackgroundColor(selectedColor); break;
                                            case "textColor": setTextColor(selectedColor); break;
                                            case "color1": setcolor1(selectedColor); break;
                                            case "color2": setcolor2(selectedColor); break;
                                            case "color3": setcolor3(selectedColor); break;
                                        }
                                        handleColorSelectorClose();
                                        setGeneratePoster(true);
                                    }}
                                    position={colorInputPosition}
                                    onClose={handleColorSelectorClose}
                                />
                            )}
                        </EditorSettings>
                    ) : (
                        <TracklistContainer>
                            <TracklistTextarea value={tracklist} onChange={(e) => setTracklist(e.target.value)} placeholder={t("EDITOR_TracklistPlaceholder")} />
                        </TracklistContainer>
                    )}

                    <DivButtons>
                        <ButtonDiv onClick={handleCoverDownloadClick}>
                            <IconDownload />
                            <ButtonText>{t("EDITOR_DownloadCover")}</ButtonText>
                        </ButtonDiv>
                        <ButtonDiv onClick={handleDownloadClick}>
                            <IconDownload />
                            <ButtonText>{t("EDITOR_Download")}</ButtonText>
                        </ButtonDiv>
                        <ButtonDiv onClick={handleApplyClick}>
                            <IconApply $spinning={spinApplyButton} />
                            <ButtonText>{t("EDITOR_Apply")}</ButtonText>
                        </ButtonDiv>
                    </DivButtons>

                    <ShortcutsInfo>{t("EDITOR_Shortcuts")}: Ctrl+S 应用 | Ctrl+D 下载</ShortcutsInfo>
                </EditorColumn>
            </ContainerEditor>
        </Container>
    );
}

export default PosterEditor;