import { Handle } from "react-flow-renderer";

const customNodeStyles = {
  background: "#fff",
  color: "#222",
  padding: "15px",
  borderRadius: "3px",
  minWidth: "150px",
  maxWidth: "250px",
  border: "1px solid #000",
  fontSize: "14px",
  textAlign: "center",
  "&.setected >div": {
    background: "red",
  },
};

// Node with 3 dotes

const Node3 = (props) => {
  return (
    <div
      style={customNodeStyles}
      // onContextMenu={(e) => {
      //   e.preventDefault();
      //   data.onRemove(this);
      // }}
    >
      {props.data.label}
      <Handle
        type="target"
        position="top"
        id="input"
        style={{
          left: "50%",
          bottom: "0%",
          borderRadius: 50,
          background: "blue",
          width: 15,
          height: 15,
        }}
      />
      <Handle
        type="source"
        position="left"
        id="success"
        style={{
          left: "-7px",
          borderRadius: 50,
          background: "red",
          width: 15,
          height: 15,
        }}
      />
      <Handle
        type="source"
        position="right"
        id="error"
        style={{
          right: "-7px",
          borderRadius: 50,
          background: "green",
          width: 15,
          height: 15,
        }}
      />
    </div>
  );
};

export default Node3;
