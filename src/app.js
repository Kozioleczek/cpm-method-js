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
  const label = `${task.name}\nDuration: ${task.duration}\nEarliest Start: ${task.earliestStart}\nLatest Start: ${task.latestStart}`;
  nodes.push({ id: task.name, label: label });
  task.dependencies.forEach((dependencyName) => {
    const edgeLabel = `${task.name}${task.duration}`;
    const edge = { from: dependencyName, to: task.name, label: edgeLabel };

    // Sprawdź, czy krawędź jest na ścieżce krytycznej
    const isCriticalEdge = criticalPathTasks.some(
      (criticalTask) =>
        criticalTask.name === task.name &&
        criticalTask.dependencies.includes(dependencyName)
    );

    // Dostosuj styl tylko dla krawędzi na ścieżce krytycznej
    if (isCriticalEdge) {
      edge.width = 2; // Pogrubienie krawędzi
      edge.color = "red"; // Zmiana koloru krawędzi
    }

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
};

// Tworzenie i wyświetlanie grafu
new Network(container, data, options);

console.log(
  "Critical Path: ",
  criticalPathTasks.map((task) => task.name)
);
