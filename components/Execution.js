'use client'
import React, { useState } from 'react';

function intersects(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function bestFitDecreasing(dimensions, paneWidth, paneHeight) {
  dimensions.sort((a, b) => (b.width * b.height) - (a.width * a.height));

  const initialNode = { x: 0, y: 0, width: paneWidth, height: paneHeight };
  const placedNodes = [];
  const notFitNodes = [];

  function findBestPlacement(node, dimension) {
    let bestFit = null;

    for (let y = 0; y <= node.height - dimension.height; y++) {
      for (let x = 0; x <= node.width - dimension.width; x++) {
        const placedNode = { x: node.x + x, y: node.y + y, width: dimension.width, height: dimension.height };
        let fits = true;

        for (const existingNode of placedNodes) {
          if (intersects(placedNode, existingNode)) {
            fits = false;
            break;
          }
        }

        if (fits) {
          if (!bestFit || (placedNode.width * placedNode.height < bestFit.width * bestFit.height)) {
            bestFit = placedNode;
          }
        }
      }
    }

    return bestFit;
  }

  function placeDimension(node, index) {
    if (index === dimensions.length) {
      return;
    }

    const dimension = dimensions[index];
    const bestFit = findBestPlacement(node, dimension);

    if (bestFit) {
      placedNodes.push(bestFit);
      const remainingNode = splitNode(node, bestFit);
      placeDimension(remainingNode, index + 1);
    } else {
      notFitNodes.push(dimension);
    }
  }

  function splitNode(node, placedNode) {
    const remainingWidth = node.width - placedNode.width;
    const remainingHeight = node.height - placedNode.height;

    if (remainingWidth > remainingHeight) {
      return { x: node.x + placedNode.width, y: node.y, width: remainingWidth, height: node.height };
    } else {
      return { x: node.x, y: node.y + placedNode.height, width: node.width, height: remainingHeight };
    }
  }

  placeDimension(initialNode, 0);

  if (notFitNodes.length === 0) {
    return [{ dimensions: placedNodes }];
  } else {
    return [{ dimensions: placedNodes, notFit: bestFitDecreasing(notFitNodes, paneWidth, paneHeight) }];
  }
}

function PaneRenderer({ paneIndex, paneWidth, paneHeight, pane }) {
  return (
    <React.Fragment>
      <h2>Pane {paneIndex + 1}</h2>
      <div style={{ position: 'relative', width: paneWidth, height: paneHeight, border: '2px solid grey' }}>
        {pane.dimensions.map((dimension, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: dimension.x,
              top: dimension.y,
              width: dimension.width,
              height: dimension.height,
              border: '1px solid red',
              boxSizing: 'border-box',
            }}
          >
            {`${dimension.width} x ${dimension.height}`}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

function DimensionCutsPage() {
  const [dimensions, setDimensions] = useState([]);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const paneWidth = 500;
  const paneHeight = 300;

  const addDimension = () => {
    if (width && height) {
      setDimensions([...dimensions, { width: parseInt(width), height: parseInt(height) }]);
      setWidth('');
      setHeight('');
    }
  };

  const panes = bestFitDecreasing(dimensions, paneWidth, paneHeight);

  return (
    <div>
      <h1>Dimension Cuts</h1>
      <div>
        <div>
          <input type="text" placeholder="Width" value={width} onChange={(e) => setWidth(e.target.value)} />
          <input type="text" placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
          <button onClick={addDimension}>Add Dimension</button>
        </div>
        <div>
          {dimensions.map((dim, index) => (
            <div key={index}>
              Width: {dim.width}, Height: {dim.height}
            </div>
          ))}
        </div>
        <div>
          {panes.map((pane, index) => (
            <div key={index} style={{ marginRight: '20px' }}>
              <PaneRenderer paneIndex={index} paneWidth={paneWidth} paneHeight={paneHeight} pane={pane} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DimensionCutsPage;
