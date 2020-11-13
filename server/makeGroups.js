const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');

const students = _.shuffle(
  JSON.parse(fs.readFileSync('./cleanedStudents.json'))
);

const studentsPerGroup = Number.parseInt(process.argv[2], 10);
const groups = [];
const nbGroups = Math.floor(students.length / studentsPerGroup);
let currentGroupIndex = 0;

for (let i = 0; i < students.length; i += 1) {
  const currentStudent = students[i];
  if (!groups[currentGroupIndex]) {
    groups[currentGroupIndex] = [];
  }

  groups[currentGroupIndex].push(currentStudent);
  if (currentGroupIndex < nbGroups - 1) {
    currentGroupIndex += 1;
  } else {
    currentGroupIndex = 0;
  }
}

for (let i = 0; i < groups.length; i += 1) {
  console.log(chalk.underline(chalk.blue(`Group n° ${i + 1}\n`))); // eslint-disable-line
  for (let j = 0; j < groups[i].length; j += 1) {
    const currentStudent = groups[i][j];
    // eslint-disable-next-line
    console.log(
      `${currentStudent.firstName} ${currentStudent.lastName
        .slice(0, 1)
        .toUpperCase()}`
    );
  }
  console.log('\n'); // eslint-disable-line
}
