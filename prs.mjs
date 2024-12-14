import { exec } from 'child_process';

exec('gh pr list --author "@me"', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  const prs = stdout
    .trim()
    .split('\n')
    .map((line) => line.split('\t').slice(0, 2))
    .reverse();
  for (const [id, title] of prs) {
    console.log(
      `- https://github.com/openai/openai-dotcom/pull/${id} - ${title}`
    );
  }
});
