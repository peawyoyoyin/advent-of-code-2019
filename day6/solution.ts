import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../utils/logger';

const inputPath = path.join(__dirname, '../inputs/day6.txt');
const rawInput = fs.readFileSync(inputPath).toString().trim();

const hints = rawInput.split('\n');
const adjacencyIndicators = hints.map(row => row.trim().split(')', 2));

logger.progress('read input. total adjacencies', hints.length);

const adjacencies: Map<string, Set<string>> = new Map<string, Set<string>>();
const bidirectionalAdjacency: Map<string, Set<string>> = new Map<string, Set<string>>();

adjacencyIndicators.forEach(([src, dest]) => {
  logger.verbose(src, 'is orbited by', dest);
  logger.verbose('(', dest, 'orbits', src, ')');
  if (!adjacencies.has(src)) {
    adjacencies.set(src, new Set<string>().add(dest));
  } else {
    adjacencies.get(src)!.add(dest);
  }

  if (!bidirectionalAdjacency.has(dest)) {
    bidirectionalAdjacency.set(dest, new Set<string>().add(src));
  } else {
    bidirectionalAdjacency.get(dest)!.add(src);
  }

  if (!bidirectionalAdjacency.has(src)) {
    bidirectionalAdjacency.set(src, new Set<string>().add(dest));
  } else {
    bidirectionalAdjacency.get(src)!.add(dest);
  }
})

logger.progress('built adjacency matrix. total nodes: ', adjacencies.size);

function BFS(
    adjacencyMatrix: Map<string, Set<string>>,
    startingPoint: string, 
    visit: (node: string, depth: number) => boolean
  ) {
  const visitedMatrix: Set<string> = new Set<string>();

  const queue: [string, number][] = [];

  queue.push([startingPoint, 0]);

  while(queue.length > 0) {
    const [node, depth] = queue.pop()!;

    logger.verbose('BFS: visiting', node);
    if (visit(node, depth)) {
      break;
    }

    visitedMatrix.add(node);

    const adjacentNodes = adjacencyMatrix.get(node);
    logger.vverbose('adjacent nodes of', node, ':', adjacentNodes);

    if (adjacentNodes !== undefined) {
      for(const adjacentNode of Array.from(adjacentNodes.values())) {
        if (!visitedMatrix.has(adjacentNode)) {
          queue.push([adjacentNode, depth + 1]);
        }
      }
    }
  }
}

const centerOfMass = 'COM';
let answer = 0;

logger.progress('start BFS for part 1');

BFS(adjacencies, centerOfMass, (node, depth) => {
  answer += depth;

  return false;
});

logger.solution('part 1', answer);
logger.progress('start BFS for part 2');

const you = 'YOU';
const santa = 'SAN';

BFS(bidirectionalAdjacency, you, (node, depth) => {
  if (node == santa) {
    logger.solution('distance between', you, 'and', santa, ':', depth);
    return true;
  } else {
    return false;
  }
});
