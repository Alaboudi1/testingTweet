import { Octokit } from "@octokit/rest";
import * as env from 'dotenv';
import devs from './devs.json';

env.config();

// Instantiate octokit with a personal access token
const octokit = new Octokit({ auth: process.env.MY_GITHUB_TOKEN });

async function getPRFiles(owner, repo, pull_number) {
    try {
        //get the diff of the pull request
        const pullrequest = await octokit.pulls.get({
            owner,
            repo,
            pull_number,
        });

        const { data: files } = await octokit.pulls.listFiles({
            owner,
            repo,
            pull_number,
        });

        //check if devs.json is modified with addtion
        const devsFile = files.find(file => file.filename === 'devs.json');
        if (devsFile && devsFile.additions > 0) {

            const newProjects = devsFile.patch.split('\n')
                .filter(line => line.startsWith('+'))
                .map(line => line.split(''))
                .map(line => line.filter(char => char !== '+' && char !== ' ' && char !== '"' && char !== ','))
                .map(line => line.join(''))
                .map(line => line.split(':'))
                .filter(line => line[0] === 'URL')
                .map(line => line[1]);
            
            console.log('New projects added in this pull request: ', newProjects);
            const developerProjects = devs.projects.find(({url}) => newProjects.includes(url));
            console.log('Developer projects: ', developerProjects);
            

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
