var express = require('express');

var app = express();

app.use(express.json());

var PORT = 3030;

app.get("/hello",(req, res) => {
    console.log(req.query);
    const { estacao } = req.query;


    if(estacao === 'verão'){
        return res.json('Está quente')
    } else if(estacao === 'Inverno'){
        return res.json('Está frio')
    } else if(estacao === 'Outono'){
        return res.json('As folhas estão caindo')
    } else{
        return res.json('estacao indefinida')
    }
})

app.post("/hello",(req, res) => {
    const { nome, idade, email } = req.body;
    const userEmail = "klonoaxel51@gmail.com";
    if(!nome || !idade || !email){
        return res.json('campos vazio detectados')
    }

    if( idade < 18){
        return res.json('usuário menor de idade')
    }

    if(email === userEmail){
        return res.json('email já cadastrado no sistema')   
    }

    return res.json('usuário criado com sucesso')
});

app.listen(PORT,() => {
    console.log('Servidor rodando na porta 3000')
})