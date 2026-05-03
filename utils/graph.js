// ========================================
// Graph Utility - Attack Path Algorithms
// ========================================

const Graph = {
  // Build adjacency list from components and flows
  buildGraph(components, flows) {
    const graph = {};
    
    components.forEach(comp => {
      graph[comp.id] = [];
    });

    flows.forEach(flow => {
      if (graph[flow.from]) {
        graph[flow.from].push({
          to: flow.to,
          label: flow.label,
          protocol: flow.protocol
        });
      }
    });

    return graph;
  },

  // Find all paths from source to target (DFS)
  findAllPaths(graph, start, end, maxDepth = 5) {
    const paths = [];
    const visited = new Set();

    const dfs = (node, path) => {
      if (path.length > maxDepth) return;
      if (node === end) {
        paths.push([...path]);
        return;
      }

      visited.add(node);

      if (graph[node]) {
        graph[node].forEach(neighbor => {
          if (!visited.has(neighbor.to)) {
            dfs(neighbor.to, [...path, neighbor.to]);
          }
        });
      }

      visited.delete(node);
    };

    dfs(start, [start]);
    return paths;
  },

  // Find shortest path (BFS)
  findShortestPath(graph, start, end) {
    const queue = [[start]];
    const visited = new Set([start]);

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      if (node === end) {
        return path;
      }

      if (graph[node]) {
        graph[node].forEach(neighbor => {
          if (!visited.has(neighbor.to)) {
            visited.add(neighbor.to);
            queue.push([...path, neighbor.to]);
          }
        });
      }
    }

    return null;
  },

  // Generate attack chains based on threats
  generateAttackChains(components, flows, threats) {
    const graph = this.buildGraph(components, flows);
    const chains = [];

    // Find entry points (external components)
    const entryPoints = components.filter(c => c.type === 'external' || c.type === 'user');
    
    // Find high-value targets (databases, APIs)
    const targets = components.filter(c => c.type === 'database' || c.type === 'api');

    entryPoints.forEach(entry => {
      targets.forEach(target => {
        const paths = this.findAllPaths(graph, entry.id, target.id);
        
        paths.forEach(path => {
          // Find threats along this path
          const pathThreats = threats.filter(t => path.includes(t.component));
          
          if (pathThreats.length > 0) {
            chains.push({
              from: entry.name,
              to: target.name,
              path: path.map(id => components.find(c => c.id === id)?.name || id),
              threats: pathThreats.map(t => t.title),
              riskScore: pathThreats.reduce((sum, t) => 
                sum + Scoring.calculateRisk(t.likelihood, t.impact), 0
              )
            });
          }
        });
      });
    });

    // Sort by risk score
    return chains.sort((a, b) => b.riskScore - a.riskScore);
  },

  // Calculate centrality (which components are most critical)
  calculateCentrality(components, flows) {
    const centrality = {};

    components.forEach(comp => {
      centrality[comp.id] = {
        name: comp.name,
        inDegree: 0,
        outDegree: 0,
        total: 0
      };
    });

    flows.forEach(flow => {
      if (centrality[flow.from]) centrality[flow.from].outDegree++;
      if (centrality[flow.to]) centrality[flow.to].inDegree++;
    });

    Object.keys(centrality).forEach(id => {
      centrality[id].total = centrality[id].inDegree + centrality[id].outDegree;
    });

    return centrality;
  },

  // Identify trust boundary violations
  findTrustBoundaryViolations(components, flows, boundaries) {
    const violations = [];

    flows.forEach(flow => {
      const fromComp = components.find(c => c.id === flow.from);
      const toComp = components.find(c => c.id === flow.to);

      if (fromComp && toComp) {
        const fromBoundary = fromComp.trustBoundary;
        const toBoundary = toComp.trustBoundary;

        if (fromBoundary !== toBoundary) {
          violations.push({
            flow: `${fromComp.name} → ${toComp.name}`,
            from: fromBoundary,
            to: toBoundary,
            protocol: flow.protocol,
            risk: 'Crosses trust boundary'
          });
        }
      }
    });

    return violations;
  }
};
