import React from "react";
import { useStoreState, useStoreActions } from "react-flow-renderer";
import {
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
} from "react-flow-renderer";

const foreignObjectSize = 40;

const onEdgeClick = (evt, id) => {
  evt.stopPropagation();
  alert(`remove ${id}`);
};

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{
            fontSize: "12px",
            // width: 20,
            // height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // borderRadius: "50%",
          }}
          startOffset="50%"
          textAnchor="middle"
          onClick={(event) => onEdgeClick(event, id)}
        >
          x
        </textPath>
      </text>
      {/*<foreignObject*/}
      {/*  width={foreignObjectSize}*/}
      {/*  height={foreignObjectSize}*/}
      {/*  x={edgeCenterX}*/}
      {/*  y={edgeCenterY}*/}
      {/*  className="edgebutton-foreignobject"*/}
      {/*  requiredExtensions="http://www.w3.org/1999/xhtml"*/}
      {/*>*/}
      {/*  <body*/}
      {/*    style={{*/}
      {/*      style,*/}
      {/*      width: 20,*/}
      {/*      height: 20,*/}
      {/*      display: "flex",*/}
      {/*      alignItems: "center",*/}
      {/*      justifyContent: "center",*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <button*/}
      {/*      className="edgebutton"*/}
      {/*      style={{*/}
      {/*        width: 20,*/}
      {/*        height: 20,*/}
      {/*        display: "flex",*/}
      {/*        alignItems: "center",*/}
      {/*        justifyContent: "center",*/}
      {/*        borderRadius: "50%",*/}
      {/*        border: "none",*/}
      {/*      }}*/}
      {/*      onClick={(event) => onEdgeClick(event, id)}*/}
      {/*    >*/}
      {/*      ×*/}
      {/*    </button>*/}
      {/*  </body>*/}
      {/*</foreignObject>*/}
    </>
  );
}
