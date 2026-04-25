/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';

const CanvasPoster = ({
    onImageReady,
    posterData,
    generatePoster,
    onTitleSizeAdjust,
    customFont,
    width = 2700,
    height = 4050,
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const generatePosterContent = async () => {
            if (!generatePoster) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            posterData.marginSide = parseInt(posterData.marginSide) || 0;
            posterData.marginTop = parseInt(posterData.marginTop) || 0;
            posterData.marginCover = parseInt(posterData.marginCover) || 0;

            const loadCover = async (url) => {
                // ✅ 自动修复 404 错误，永远不加载 default-cover.png
                if (!url || url === '/default-cover.png') {
                    url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                }

                const image = new Image();
                image.crossOrigin = "anonymous";
                image.src = url;
                return new Promise((resolve) => {
                    image.onload = () => {
                        ctx.drawImage(
                            image,
                            posterData.marginCover,
                            posterData.marginCover,
                            width - posterData.marginCover * 2,
                            width - posterData.marginCover * 2
                        );
                        if (posterData.useFade) {
                            let verticalFade = ctx.createLinearGradient(0, 0, 0, Math.round(height * 0.80));
                            const rgb = hexToRgb(posterData.backgroundColor);
                            verticalFade.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
                            verticalFade.addColorStop(0.8, posterData.backgroundColor);
                            ctx.fillStyle = verticalFade;
                            ctx.fillRect(0, 0, canvas.width, Math.round(height * 0.71));
                        }
                        resolve();
                    };
                    // ✅ 图片加载失败也不报错
                    image.onerror = () => resolve();
                });
            };

            const drawAlbumInfos = async () => {
                let titleFontSize = posterData.titleSize ? parseInt(posterData.titleSize) : Math.round(width * 0.093);
                const fontFamily = customFont || 'Montserrat';
                if (!posterData.userAdjustedTitleSize && !posterData.initialTitleSizeSet) {
                    ctx.font = `bold ${titleFontSize}px ${fontFamily}`;
                    let titleWidth = ctx.measureText(posterData.albumName).width;

                    while (titleWidth > (width - posterData.marginSide * 2)) {
                        titleFontSize -= 1;
                        ctx.font = `bold ${titleFontSize}px ${fontFamily}`;
                        titleWidth = ctx.measureText(posterData.albumName).width;
                    }
                    onTitleSizeAdjust(titleFontSize, true);
                } else {
                    ctx.font = `bold ${titleFontSize}px ${fontFamily}`;
                }
                ctx.fillStyle = posterData.textColor;

                const albumY = posterData.showTracklist
                    ? Math.round(width * 1.045) + posterData.marginTop
                    : Math.round(height * 0.796) + posterData.marginTop;

                ctx.fillText(posterData.albumName, posterData.marginSide, albumY);

                let artistsFontSize = posterData.artistsSize ? parseInt(posterData.artistsSize) : Math.round(width * 0.044);
                ctx.font = `bold ${artistsFontSize}px ${fontFamily}`;

                ctx.fillText(
                    posterData.artistsName,
                    posterData.marginSide,
                    albumY + artistsFontSize * 1.3
                );

                ctx.font = `bold ${Math.round(width * 0.032)}px ${fontFamily}`;
                const infoY = Math.round(height * 0.936);

                ctx.fillText(posterData.titleRelease, posterData.marginSide, infoY);
                let releaseWidth = ctx.measureText(posterData.titleRelease).width;
                ctx.fillText(posterData.titleRuntime, releaseWidth + posterData.marginSide + Math.round(width * 0.04), infoY);

                ctx.globalAlpha = 0.7;
                ctx.font = `bold ${Math.round(width * 0.032)}px ${fontFamily}`;
                ctx.fillText(posterData.runtime, releaseWidth + posterData.marginSide + Math.round(width * 0.04), infoY + Math.round(width * 0.038));
                ctx.fillText(posterData.releaseDate, posterData.marginSide, infoY + Math.round(width * 0.038));
                ctx.globalAlpha = 1;

                const barY = infoY + Math.round(width * 0.032);
                const barW = Math.round(width * 0.064);
                const barH = Math.round(width * 0.014);
                ctx.fillStyle = posterData.color1;
                ctx.fillRect(Math.round(width * 0.803) - posterData.marginSide, barY, barW, barH);
                ctx.fillStyle = posterData.color2;
                ctx.fillRect(Math.round(width * 0.86872) - posterData.marginSide, barY, barW, barH);
                ctx.fillStyle = posterData.color3;
                ctx.fillRect(Math.round(width * 0.934) - posterData.marginSide, barY, barW, barH);
            };

            const drawTracklist = async () => {
                ctx.fillStyle = posterData.textColor;
                let paddingMusic = posterData.marginSide + 10;
                let maxWidth = 0;
                let paddingColumn = 0;
                const fontSize = posterData.tracksSize ? parseInt(posterData.tracksSize) : Math.round(width * 0.02);
                ctx.font = `bold ${fontSize}px ${customFont || 'Montserrat'}`;
                const musicSize = fontSize;

                const marginTop = parseInt(posterData.marginTop || 0);
                const rectY = posterData.artistsSize
                    ? Math.round(width * 1.01) + marginTop + parseInt(posterData.artistsSize) * 1.155 + Math.round(width * 0.095)
                    : Math.round(width * 1.01) + marginTop + Math.round(width * 0.044 * 1.2) + Math.round(width * 0.042);
                const rectHeight = Math.round(width * 0.25);
                const rectWidth = width - (posterData.marginSide * 2);
                const rectX = parseInt(posterData.marginSide);
                const maxTextHeight = rectY + rectHeight - 10 - parseInt(posterData.marginTop);

                let textHeight = rectY;

                if (posterData.tracklist) {
                    posterData.tracklist.split('\n').forEach((track) => {
                        if (textHeight + musicSize * 1.3 >= maxTextHeight) {
                            textHeight = rectY;
                            paddingMusic = maxWidth + (musicSize * 2.5) + paddingColumn;
                            if (paddingMusic >= rectX + rectWidth) return;
                            paddingColumn = paddingMusic - (musicSize * 2.5);
                            maxWidth = 0;
                        }
                        const textWidth = ctx.measureText(`${track}`).width + posterData.marginSide;
                        if (textWidth > maxWidth) {
                            maxWidth = textWidth;
                        }
                        ctx.fillText(`${track}`, paddingMusic, textHeight);
                        textHeight += (musicSize * 1.3);
                    });
                }
            };

            const hexToRgb = (hex) => {
                const bigint = parseInt(hex.replace("#", ""), 16);
                return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
            };

            const drawBackground = async () => {
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = posterData.backgroundColor;
                ctx.fillRect(0, 0, width, height);
            };

            await drawBackground();
            await loadCover(posterData.albumCover);
            await drawAlbumInfos();
            if (posterData.showTracklist) {
                await drawTracklist();
            }

            const imageUrl = canvas.toDataURL('image/png');
            onImageReady(imageUrl);
        };

        generatePosterContent();
    }, [generatePoster, posterData, onImageReady, width, height, customFont, onTitleSizeAdjust]);

    return <canvas ref={canvasRef} width={width} height={height} style={{ display: 'none' }} />;
};

export default CanvasPoster;