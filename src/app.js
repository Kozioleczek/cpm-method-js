import * as CpmMethod from "./cpm-method";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

// Inicjalizacja danych
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

const generateGraph = () => {
  // Wygeneruj graf na podstawie danych
  CpmMethod.calculateEarliestStart(tasks);
  CpmMethod.calculateLatestStart(tasks, tasks[tasks.length - 1].earliestFinish);

  let criticalPathTasks = CpmMethod.findCriticalPath(tasks);
  console.log("🚀 ~ generateGraphButton.addEventListener ~ tasks:", tasks);

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
};

document.addEventListener("DOMContentLoaded", function () {
  const taskTable = document.getElementById("taskTable");
  const tbody = taskTable.querySelector("tbody");
  const resetButton = document.getElementById("resetButton");
  const generateGraphButton = document.getElementById("generateGraphButton");
  const addRowButton = document.getElementById("addRowButton");

  let idCounter = 1;

  function addRow(taskName, taskDuration, taskDependencies) {
    const row = document.createElement("tr");
    const idCell = document.createElement("td");
    idCell.textContent = String.fromCharCode(64 + idCounter);
    idCounter++;
    const durationCell = document.createElement("td");
    const durationInput = document.createElement("input");
    durationInput.type = "number";
    durationInput.value = taskDuration;
    durationCell.appendChild(durationInput);
    const dependenciesCell = document.createElement("td");
    const dependenciesInput = document.createElement("input");
    dependenciesInput.type = "text";
    dependenciesInput.value = taskDependencies.join(",");
    dependenciesCell.appendChild(dependenciesInput);
    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń";
    deleteButton.addEventListener("click", () => {
      row.remove();
    });
    deleteCell.appendChild(deleteButton);
    row.appendChild(idCell);
    row.appendChild(durationCell);
    row.appendChild(dependenciesCell);
    row.appendChild(deleteCell);
    tbody.appendChild(row);
  }

  // Inicjalnie dodaj wiersze z danymi
  tasks.forEach((task) => {
    addRow(task.name, task.duration, task.dependencies);
  });

  generateGraph();

  addRowButton.addEventListener("click", () => {
    addRow("", 0, []);
  });

  resetButton.addEventListener("click", () => {
    tbody.innerHTML = ""; // Wyczyść tabelę
    idCounter = 1; // Zresetuj licznik ID
    tasks = []; // Wyczyść dane zadań
  });

  generateGraphButton.addEventListener("click", () => {
    tasks = [];
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row) => {
      const idCell = row.querySelector("td:nth-child(1)");
      const durationCell = row.querySelector("td:nth-child(2) input");
      const dependenciesCell = row.querySelector("td:nth-child(3) input");
      if (idCell && durationCell && dependenciesCell) {
        const name = idCell.textContent;
        const duration = parseInt(durationCell.value, 10);
        console.log("🚀 ~ rows.forEach ~ duration:", duration);
        let dependencies = dependenciesCell.value
          .split(",")
          .map((dep) => dep.trim());

        if (dependencies.includes("")) {
          dependencies = [];
        }

        console.log("🚀 ~ rows.forEach ~ dependencies:", dependencies);
        const task = new CpmMethod.Task(name, duration, dependencies);
        tasks.push(task);
      }
    });
    console.log("🚀 ~ generateGraphButton.addEventListener ~ tasks:", tasks);

    generateGraph();
  });
});
