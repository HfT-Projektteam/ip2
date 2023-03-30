/* eslint-disable semi */
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function main () {
  const forbiddenBranches = ['main'];
  const allowedBranchPrefixes = ['devops/', 'backend/', 'frontend', 'fix/', 'renovate/'];
  const { stdout, stderr } = await exec('git rev-parse --abbrev-ref HEAD');
  let branch = stdout;
  branch = branch.replace(/\r?\n|\r/g, '') // remove new line char from stdout

  if (stderr) {
    console.error(`ERROR: ${stderr}`);
    process.exit(1);
  }
  if (forbiddenBranches.indexOf(branch) >= 0) {
    console.error(`ERROR: It is forbidden to commit on the following branches: ${forbiddenBranches.join(', ')}`);
    process.exit(1);
  }
  if (!allowedBranchPrefixes.some((prefix) => branch.indexOf(prefix) === 0)) {
    console.error(`ERROR: Your current branch name (${branch}) is not allowed.`);
    console.error(`Make sure that you commit on a branch with a prefix in: ${allowedBranchPrefixes.join(', ')}`);
    process.exit(1);
  }
  console.log(`You will commit on ${branch}. Perfect, you follow our best practices!`);
  process.exit(0);
}

main();
