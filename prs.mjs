import { execSync } from 'child_process';

const [org, repo] = execSync('git remote -v')
  .toString()
  .split(/\s+/)[1]
  .split(/[:/.]/)
  .slice(-3, -1);

const prs = execSync('gh pr list --author "@me"')
  .toString()
  .trim()
  .split('\n')
  .map((line) => line.split('\t').slice(0, 2))
  .reverse();

for (const [id, title] of prs) {
  console.log(`- https://github.com/${org}/${repo}/pull/${id} - ${title}`);
}
