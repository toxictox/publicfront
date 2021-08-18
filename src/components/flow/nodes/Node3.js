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
  position: "relative",
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
          top: "-7px",
          borderRadius: 50,
          background: "blue",
          width: 15,
          height: 15,
        }}
      />
      <Handle
        type="source"
        position="bottom"
        id="error"
        style={{
          left: "20%",
          borderRadius: 50,
          background: "red",
          width: 15,
          height: 15,
          bottom: "-7px",
        }}
      />
      <Handle
        type="source"
        position="bottom"
        id="success"
        style={{
          left: "80%",
          borderRadius: 50,
          background: "green",
          bottom: "-7px",
          width: 15,
          height: 15,
        }}
      />
    </div>
  );
};

export default Node3;
