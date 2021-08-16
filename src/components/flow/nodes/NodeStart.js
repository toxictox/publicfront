import { Handle } from "react-flow-renderer";

const customNodeStyles = {
  background: "#ffef59",
  color: "#222",
  padding: "15px 10px",
  borderRadius: "3px",
  minWidth: "150px",
  maxWidth: "250px",
  border: "1px solid #000",
  fontSize: "14px",
  textAlign: "center",
};

// Node with 3 dotes

const NodeStart = ({ data }) => {
  return (
    <div style={customNodeStyles}>
      {data.label}
      <Handle
        type="output"
        position="bottom"
        id="input"
        style={{
          left: "50%",
          bottom: "-7px",
          borderRadius: 50,
          background: "#000",
          width: 15,
          height: 15,
        }}
      />
    </div>
  );
};

export default NodeStart;
