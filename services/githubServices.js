const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({});

async function getRepository(username, page = 1, perPage = 10) {
    const response = await octokit.repos.listForUser({
      username,
      per_page: perPage,
      page
    });
  console.log(response.data);
    var repos = []
    for(let i = 0; i < response.data.length; i++){
      const {id, name, full_name} = response.data[i];
      repos.push({id, name, full_name});
    }
    
    return repos;
  }

module.exports = {
    getRepository,
  };
