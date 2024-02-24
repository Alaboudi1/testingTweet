import { Octokit } from "@octokit/rest";

// Instantiate octokit with a personal access token
const octokit = new Octokit({ auth: process.env.MY_GITHUB_TOKEN });

async function getPRFiles(owner, repo, pull_number) {
    try {
        const { data } = await octokit.pulls.listFiles({
            owner,
            repo,
            pull_number,
        });

        console.log("Changed files:");
        data.forEach(file => {
            console.log(`${file.filename} - ${file.status}`);
        });
    } catch (error) {
        console.error('Error fetching PR files:', error);
    }
}

// Assumes you have GITHUB_REPOSITORY and GITHUB_TOKEN set in your environment variables
const [owner, repo] = "Alaboudi1/testingTweet".split('/');
const pullNumber = parseInt(process.env.PULL_REQUEST_NUMBER, 10);

if (!owner || !repo || isNaN(pullNumber)) {
    console.error('Missing or invalid environment variables!');
    process.exit(1);
}

getPRFiles(owner, repo, pullNumber);
