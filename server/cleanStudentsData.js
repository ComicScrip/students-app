const fs = require('fs');

const studentsRawFileContents = fs.readFileSync('./studentsRaw.txt', {
  encoding: 'utf-8',
});

const studentLines = studentsRawFileContents.split('\n');
const cleanedStudentEntries = [];

for (let i = 0; i < studentLines.length; i += 1) {
  const currentStudentParts = studentLines[i].split(' ');
  if (currentStudentParts.length === 2) {
    cleanedStudentEntries.push({
      firstName: currentStudentParts[0],
      lastName: currentStudentParts[1],
    });
  } else if (currentStudentParts.length === 3) {
    cleanedStudentEntries.push({
      firstName: currentStudentParts[1],
      lastName: currentStudentParts[2],
    });
  }
}

fs.writeFileSync('cleanedStudents.json', JSON.stringify(cleanedStudentEntries));
console.log('Done !'); // eslint-disable-line
