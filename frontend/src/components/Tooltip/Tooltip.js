import React, { useState } from "react";
import "./Tooltip.scss";

function Tooltip({ children, title }) {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const showTooltip = (e) => {
    setShow(true);
    adjustTooltipPosition(e);
  };

  const hideTooltip = () => setShow(false);

  const moveTooltip = (e) => {
    adjustTooltipPosition(e);
  };

  const adjustTooltipPosition = (e) => {
    const tooltipWidth = 150; // Approximate width of the tooltip
    const tooltipHeight = 40; // Approximate height of the tooltip
    const offset = 10; // Space between cursor and tooltip

    let x = e.clientX + offset;
    let y = e.clientY + offset;

    // Check for overflow on the right
    if (x + tooltipWidth > window.innerWidth) {
      x = window.innerWidth - tooltipWidth - offset;
    }

    // Check for overflow on the bottom
    if (y + tooltipHeight > window.innerHeight) {
      y = window.innerHeight - tooltipHeight - offset;
    }

    setTooltipPosition({ x, y });
  };

  return (
    <div
      className="Tooltip"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onMouseMove={moveTooltip}
    >
      {children}
      {show && (
        <div
          className="Tooltip-text"
          style={{
            top: tooltipPosition.y + "px",
            left: tooltipPosition.x + "px",
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
