const { exec } = require("child_process");

exec(`git log ${process.argv[2] || "origin/main.."}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  const commits = (stdout + "\n")
    .split(/commit [0-9a-f]{40}\n/)
    .slice(1)
    .reverse();
  for (let commit of commits) {
    const lines = commit.split("\n");
    const title = lines[3].substr(4);
    const link = lines[lines.length - 3].substr(27);
    console.log(`- ${link} ${title}`);
  }
});
