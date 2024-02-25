import { Octokit } from "@octokit/rest";

// Instantiate octokit with a personal access token
const octokit = new Octokit({ auth: process.env.MY_GITHUB_TOKEN });

async function getPRFiles(owner, repo, pull_number) {
    try {
        //get the diff of the pull request
        const { data: diff } = await octokit.pulls.get({
            owner,
            repo,
            pull_number,
        });

        //check if devs.json is modified with addtion
        const devsFile = diff.find(file => file.filename === 'devs.json');
        if (devsFile && devsFile.additions > 0) {
            console.log('devs.json was modified with additions');
            console.log('The diff of the file is: ', devsFile);
        } else {
            console.log('devs.json was not modified with additions');
        }
}
    catch (error) {
        console.error('Error getting pull request files: ', error);
    }
}

// Assumes you have GITHUB_REPOSITORY and GITHUB_TOKEN set in your environment variables
const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
const pullNumber = parseInt(process.env.PULL_REQUEST_NUMBER, 10);

if (!owner || !repo || isNaN(pullNumber)) {
    console.error('Missing or invalid environment variables!');
    process.exit(1);
}

getPRFiles(owner, repo, pullNumber);
