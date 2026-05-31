import React, { useState } from 'react';

const ImageMagnifier = ({
    src,
    alt,
    magnifierHeight = 200,
    magnifierWidth = 200,
    zoomLevel = 2.5
}) => {
    const [[x, y], setXY] = useState([0, 0]);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
    const [showMagnifier, setShowMagnifier] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                height: "100%",
                width: "100%",
                cursor: "none"
            }}
            onMouseEnter={(e) => {
                const elem = e.currentTarget;
                const { width, height } = elem.getBoundingClientRect();
                setSize([width, height]);
                setShowMagnifier(true);
            }}
            onMouseMove={(e) => {
                const elem = e.currentTarget;
                const { top, left } = elem.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;
                setXY([x, y]);
            }}
            onMouseLeave={() => {
                setShowMagnifier(false);
            }}
        >
            <img
                src={src}
                alt={alt}
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                className="transition-transform duration-700 group-hover:scale-105"
            />

            <div
                style={{
                    display: showMagnifier ? "block" : "none",
                    position: "absolute",
                    pointerEvents: "none",
                    height: `${magnifierHeight}px`,
                    width: `${magnifierWidth}px`,
                    top: `${y - magnifierHeight / 2}px`,
                    left: `${x - magnifierWidth / 2}px`,
                    opacity: 1,
                    border: "2px solid rgba(255, 255, 255, 0.5)",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    backgroundImage: `url('${src}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                    backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
                    backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                    zIndex: 50,
                }}
            />
        </div>
    );
};

export default ImageMagnifier;
