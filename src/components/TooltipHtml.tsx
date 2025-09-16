import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props={
  position?:'fixed'|'absolute';
  children?:any;
  title?:any;
  placement?:'top'|'bottom'
}

const TooltipHtml = ({position='fixed', children,title,placement}:Props) => {
  const buttonRef = useRef<any>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
   const [dropdownStyle, setDropdownStyle] = useState({});

     useEffect(() => {
          if (tooltipVisible && buttonRef.current) {
              const scrollX = position == 'fixed' ? (window.screenX || window.screenLeft) : (window.scrollX)
              const scrollY = position == 'fixed' ? (window.screenY || window.screenTop) : (window.scrollY)
              const rect = buttonRef.current.getBoundingClientRect();
  
              let left=rect.left + scrollX
              let top=rect.bottom + scrollY
              if(position=='fixed'){
                  left=rect.left
                  top=rect.bottom
              }
          
              setDropdownStyle({
                  position:position,
                  top: `${top}px`,
                  left: `${left}px`,
                  minWidth: `${rect.width}px`,
                  zIndex: 9999,
              });
          }
      }, [tooltipVisible]);

  return (<>
 <span 
    className="inline-block"
    ref={buttonRef}
    onMouseEnter={()=>{
      setTooltipVisible(true)
    }}
    onMouseLeave={()=>{
      setTooltipVisible(false)
    }}

    onTouchStart={()=>{
      setTooltipVisible(true)
    }}
    onTouchEnd={()=>{
      setTimeout(()=>{
        setTooltipVisible(false)
      },1000)
    }}
    // onTouchStartCapture={()=>{
    //   setTooltipVisible(true)
    // }}
    // onTouchEndCapture={()=>{
    //   setTooltipVisible(false)
    // }}
    >{children}</span>
    {tooltipVisible ? <>
      {createPortal(<>
        <div role="tooltip" style={dropdownStyle} className={`z-9999 ${tooltipVisible ? '' : 'invisible'} inline-block px-3 py-2 text-sm font-medium text-white duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700`}>
          {title}
          <div className="tooltip-arrow"></div>
        </div>
      </>, document.body)}
    </> : <></>}
  </>
    );
};

export default TooltipHtml;
