const { eachWeekOfInterval, format, startOfWeek } = require('date-fns');
const csv = require('fast-csv');
const fs = require('fs');

/**
 * @type {{
 *   Status: string,
 *   Assignee: string,
 *   'Fix Version/s': string,
 *   'Issue key': string,
 *   Summary: string,
 *   Resolved: string,
 *   'Issue id': string,
 *   'Custom field (Story Points)': string,
 *   'Custom field (Epic Link)': string
 * }[]}
 */
const issues = [];

fs.createReadStream(process.argv[2] ?? 'issues.csv')
  .pipe(csv.parse({ headers: true }))
  .on('error', (error) => console.error(error))
  .on('data', (row) => issues.push(row))
  .on('end', (rowCount) => {
    console.log(`Parsed ${rowCount} rows`);

    // console.log('issues:', issues);

    const dates = issues
      .map((i) => i.Resolved)
      .filter(Boolean)
      .map(Date.parse)
      .sort((a, b) => a - b);

    const weeks = eachWeekOfInterval({
      start: dates[0],
      end: dates[dates.length - 1],
    });
    const columns = [...weeks.map((w) => format(w, 'P')), 'Unresolved'];

    const users = new Set(issues.map((i) => i.Assignee));
    // console.log('users:', users);

    // points per user per week
    const velocities = Object.assign(
      ...[...users].map((u) => ({
        [u]: Object.assign(...columns.map((c) => ({ [c]: 0 }))),
      }))
    );
    for (const issue of issues) {
      const col = issue.Resolved
        ? format(startOfWeek(Date.parse(issue.Resolved)), 'P')
        : 'Unresolved';
      velocities[issue.Assignee][col] += +issue['Custom field (Story Points)'];
    }
    // console.log('velocities:', velocities);

    const rows = [
      ['', ...columns],
      ...[...users].map((u) => [
        u.split('@')[0],
        ...Object.values(velocities[u]),
      ]),
    ];
    // console.log(rows);
    csv
      .writeToPath(process.argv[3] ?? 'velocities.csv', rows)
      .on('error', (err) => console.error(err))
      .on('finish', () => console.log('Done writing'));
  });
