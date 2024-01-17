class Task {
  constructor(name, duration, dependencies = []) {
    this.name = name;
    this.duration = duration;
    this.dependencies = dependencies;
    this.earliestStart = 0;
    this.latestStart = Infinity;
    this.earliestFinish = this.duration;
    this.latestFinish = Infinity;
  }
}

function calculateEarliestStart(tasks) {
  tasks.forEach((task) => {
    task.dependencies.forEach((dependencyName) => {
      const dependency = tasks.find((t) => t.name === dependencyName);
      task.earliestStart = Math.max(
        task.earliestStart,
        dependency.earliestFinish
      );
      task.earliestFinish = task.earliestStart + task.duration;
    });
  });
}

function calculateLatestStart(tasks, projectDuration) {
  tasks
    .slice()
    .reverse()
    .forEach((task) => {
      if (task.latestStart === Infinity) {
        task.latestStart = projectDuration - task.duration;
      }

      task.latestFinish = task.latestStart + task.duration;

      task.dependencies.forEach((dependencyName) => {
        const dependency = tasks.find((t) => t.name === dependencyName);
        dependency.latestFinish = Math.min(
          dependency.latestFinish,
          task.latestStart
        );
        dependency.latestStart = dependency.latestFinish - dependency.duration;
      });
    });
}

function findCriticalPath(tasks) {
  return tasks.filter((task) => task.earliestStart === task.latestStart);
}

//   let tasks = [
//     new Task("A", 0),
//     new Task("B", 10, ["A"]),
//     new Task("C", 20, ["A"]),
//     new Task("D", 30, ["B", "C"]),
//     new Task("E", 20, ["B", "C"]),
//     new Task("F", 40, ["E"]),
//     new Task("G", 20, ["D", "F"]),
//     new Task("H", 0, ["G"]),
//   ];

// calculateEarliestStart(tasks);
// calculateLatestStart(tasks, tasks[tasks.length - 1].earliestFinish);

//   let criticalPathTasks = findCriticalPath(tasks);
//   console.log(
//     "Critical Path: ",
//     criticalPathTasks.map((task) => task.name)
//   );

export { calculateEarliestStart, calculateLatestStart, findCriticalPath, Task };
