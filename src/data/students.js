export const getFullName = (student) => {
  return `${student.firstName} ${student.lastName}`;
};

export const getGitHubAccountUrl = (stduent) => {
  return `https://github.com/${stduent.githubUserName}`;
};

export const getAvatarUrl = (student) => {
  return `https://github.com/${student.githubUserName}.png`;
};

export const persistAll = (students) => {
  localStorage.setItem('students', JSON.stringify(students));
};
