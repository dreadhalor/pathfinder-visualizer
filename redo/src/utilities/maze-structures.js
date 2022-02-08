const getDimensions = (grid) => {
  return [grid?.length ?? 0, grid?.[0]?.length ?? 0];
};
export const getNodes = (grid) => {
  const [rows, cols] = getDimensions(grid);
  let nodes = [];
  for (let i = 0; i < rows; i += 2) {
    for (let j = 0; j < cols; j += 2) {
      nodes.push([i, j]);
    }
  }
  return nodes;
};
export const getAdjacencyList = (grid) => {
  const [rows, cols] = getDimensions(grid);
  let adjacencyList = new Map();
  for (let i = 0; i < rows; i += 2) {
    for (let j = 0; j < cols; j += 2) {
      let neighbors = [];
      if (i < rows - 2) neighbors.push([i + 2, j]);
      if (i > 1) neighbors.push([i - 2, j]);
      if (j < cols - 2) neighbors.push([i, j + 2]);
      if (j > 1) neighbors.push([i, j - 2]);
      adjacencyList.set(JSON.stringify([i, j]), neighbors);
    }
  }
  return adjacencyList;
};
export const getStringifiedNodes = (grid) => {
  const [rows, cols] = getDimensions(grid);
  let nodes = [];
  for (let i = 0; i < rows; i += 2) {
    for (let j = 0; j < cols; j += 2) {
      nodes.push(JSON.stringify([i, j]));
    }
  }
  return nodes;
};
export const getEdges = (grid) => {
  const [rows, cols] = getDimensions(grid);
  let edges = [];
  for (let i = 0; i < rows; i += 2) {
    for (let j = 0; j < cols; j += 2) {
      //bidirectional, so only add edges topleft-to-bottomright to avoid cycles
      if (i < rows - 2) {
        edges.push([
          [i, j],
          [i + 2, j],
        ]);
      }
      if (j < cols - 2) {
        edges.push([
          [i, j],
          [i, j + 2],
        ]);
      }
    }
  }
  return edges;
};
export const getStringifiedEdges = (grid) => {
  const [rows, cols] = getDimensions(grid);
  let edges = [];
  for (let i = 0; i < rows; i += 2) {
    for (let j = 0; j < cols; j += 2) {
      //bidirectional, so only add edges topleft-to-bottomright to avoid cycles
      if (i < rows - 2) {
        edges.push([JSON.stringify([i, j]), JSON.stringify([i + 2, j])]);
      }
      if (j < cols - 2) {
        edges.push([JSON.stringify([i, j]), JSON.stringify([i, j + 2])]);
      }
    }
  }
  return edges;
};
export const getStringifiedNodesAndEdges = (grid) => {
  const [rows, cols] = getDimensions(grid);
  let nodes = [],
    edges = [];
  for (let i = 0; i < rows; i += 2) {
    for (let j = 0; j < cols; j += 2) {
      //use strings so no funny business happens with tuple equality
      nodes.push(JSON.stringify([i, j]));
      //bidirectional, so only add edges topleft-to-bottomright to avoid cycles
      if (i < rows - 2) {
        edges.push([JSON.stringify([i, j]), JSON.stringify([i + 2, j])]);
      }
      if (j < cols - 2) {
        edges.push([JSON.stringify([i, j]), JSON.stringify([i, j + 2])]);
      }
    }
  }
  return [nodes, edges];
};
export const getStringifiedNodesAndEdgesByRow = (grid) => {
  const [rows, cols] = getDimensions(grid);
  let row_nodes = [],
    row_edges = [];
  for (let i = 0; i < rows; i += 2) {
    let nodes = [],
      edges = [];
    for (let j = 0; j < cols; j += 2) {
      //use strings so no funny business happens with tuple equality
      nodes.push(JSON.stringify([i, j]));
      //bidirectional, so only add edges topleft-to-bottomright to avoid cycles
      // if (i < rows - 2) {
      //   edges.push([JSON.stringify([i, j]), JSON.stringify([i + 2, j])]);
      // }
      if (j < cols - 2) {
        edges.push([JSON.stringify([i, j]), JSON.stringify([i, j + 2])]);
      }
    }
    row_nodes.push(nodes);
    row_edges.push(edges);
  }
  return [row_nodes, row_edges];
};
export const expandEdge = (edge_tuple) => {
  let [stringified_n1, stringified_n2] = edge_tuple;
  let [node_r, node_c] = JSON.parse(stringified_n1);
  let [next_r, next_c] = JSON.parse(stringified_n2);
  let full_edge = [];
  if (stringified_n1 === stringified_n2) full_edge.push([node_r, node_c]);
  else if (node_r === next_r) {
    if (node_c < next_c) {
      for (let c = node_c; c <= next_c; c++) full_edge.push([node_r, c]);
    } else for (let c = node_c; c >= next_c; c--) full_edge.push([node_r, c]);
  } else {
    if (node_r < next_r) {
      for (let r = node_r; r <= next_r; r++) full_edge.push([r, node_c]);
    } else for (let r = node_r; r >= next_r; r--) full_edge.push([r, node_c]);
  }
  return full_edge;
};
export const getFullEdges = (edges_as_tuples) => {
  let full_edges = edges_as_tuples.map((tuple) => expandEdge(tuple));
  return full_edges;
};
