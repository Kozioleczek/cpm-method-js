import * as CpmMethod from "./cpm-method";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

let tasks = [
  new CpmMethod.Task("A", 0),
  new CpmMethod.Task("B", 10, ["A"]),
  new CpmMethod.Task("C", 20, ["A"]),
  new CpmMethod.Task("D", 30, ["B", "C"]),
  new CpmMethod.Task("E", 20, ["B", "C"]),
  new CpmMethod.Task("F", 40, ["E"]),
  new CpmMethod.Task("G", 20, ["D", "F"]),
  new CpmMethod.Task("H", 0, ["G"]),
];

CpmMethod.calculateEarliestStart(tasks);
CpmMethod.calculateLatestStart(tasks, tasks[tasks.length - 1].earliestFinish);

let criticalPathTasks = CpmMethod.findCriticalPath(tasks);

// Tworzenie danych dla grafu
let nodes = [];
let edges = [];

tasks.forEach((task) => {
  const label = `${task.name}\nES: ${task.earliestStart}\nLS: ${task.latestStart}\n ======== \nEF: ${task.earliestFinish}\nLF: ${task.latestFinish}`;

  // Sprawdź, czy węzeł jest na ścieżce krytycznej
  const isCriticalNode = criticalPathTasks.some(
    (criticalTask) => criticalTask.name === task.name
  );

  // Dostosuj styl węzłów na ścieżce krytycznej
  const nodeStyle = {
    id: task.name,
    label: label,
    color: isCriticalNode ? "red" : "lightblue", // Zmiana koloru węzła na ścieżce krytycznej
    borderWidth: isCriticalNode ? 3 : 1, // Zmiana grubości obramowania węzła na ścieżce krytycznej
  };

  nodes.push(nodeStyle);

  task.dependencies.forEach((dependencyName) => {
    const edgeLabel = `${dependencyName}${task.name}${task.duration}`;
    const edge = { from: dependencyName, to: task.name, label: edgeLabel };
    edge.color = "gray";
    edges.push(edge);
  });
});

// Konfiguracja opcji grafu
const container = document.getElementById("mynetwork");
const data = {
  nodes: new DataSet(nodes),
  edges: new DataSet(edges),
};
const options = {
  edges: {
    color: "gray",
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5, // Skalowanie rozmiaru strzałki
      },
    },
  },
  layout: {
    hierarchical: {
      enabled: true,
      direction: "UD", // Kierunek układu (Left to Right)
      sortMethod: "directed", // Sortowanie węzłów
      levelSeparation: 200,
      nodeSpacing: 200,
    },
  },
  nodes: {
    shape: "box", // Kształt węzła (możesz użyć innych kształtów)
  },
};

// Tworzenie i wyświetlanie grafu
new Network(container, data, options);

console.log(
  "Critical Path: ",
  criticalPathTasks.map((task) => task.name)
);

console.log("🚀 ~ tasks:", tasks);
