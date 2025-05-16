const express = require('express');
const router = express.Router();
const githubService = require('../services/githubServices');

router.get("/github", async (req, res) => {
    try {
        const { username, perPage, page } = req.query
        const repo = await githubService.getRepository(username, page, perPage);
        console.log("repo", repo)
        return res.status(200).json(repo);
    } catch (error) {
        res.status(500).send({message: `${error.message} - erro ao procurar repositório`})
    }
});

module.exports = router;