import Node3 from "./Node3";
import NodeStart from "./NodeStart";
import NodeRemove from "./NodeRemove";

const nodeTypes = {
  start: NodeStart,
  node3: Node3,
  buttonedge: NodeRemove,
};

export default nodeTypes;
