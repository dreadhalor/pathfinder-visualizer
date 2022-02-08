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
const expandEdge = (edge_tuple) => {
  let [stringified_n1, stringified_n2] = edge_tuple;
  let [n1_r, n1_c] = JSON.parse(stringified_n1);
  let [n2_r, n2_c] = JSON.parse(stringified_n2);
  let full_edge = [];
  if (stringified_n1 === stringified_n2) full_edge.push([n1_r, n1_c]);
  else if (n1_r === n2_r) {
    let r = n1_r;
    let min = Math.min(n1_c, n2_c),
      max = Math.max(n1_c, n2_c);
    for (let c = min; c <= max; c++) full_edge.push([r, c]);
  } else if (n1_c === n2_c) {
    let c = n1_c;
    let min = Math.min(n1_r, n2_r),
      max = Math.max(n1_r, n2_r);
    for (let r = min; r <= max; r++) full_edge.push([r, c]);
  }
  return full_edge;
};
export const getFullEdges = (edges_as_tuples) => {
  let full_edges = edges_as_tuples.map((tuple) => expandEdge(tuple));
  return full_edges;
};
