const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../user');
const jwt = require('jsonwebtoken');

router.post("/", verifyToken, async (req, res) => {
    try {
        const { age } = req.body;
        
        // Verifica se o usuário é menor de idade antes de continuar
        if (age < 18) {
            return res.json('usuário menor de idade');
        }

        // Cria uma instância de usuário com os dados recebidos
        const user = new User(req.body);

        // Salva o usuário no banco de dados
        await user.save();

        // Retorna uma resposta de sucesso após salvar
        return res.status(201).send(user.toJSON());
        
    } catch (error) {
        // Retorna um erro caso algo falhe
        return res.status(501).send({ message: `${error.message} - erro ao cadastrar usuário` });
    }
});


router.get("/", verifyToken, async (req, res) => {
    try {
        const user = await User.find();
        console.log("user", user)
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).send({message: `${error.message} - erro ao procurar usuário`})
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const email = "leonardosavallone@outlook.com";
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        if (user.email === email) {
            return res.status(403).send({ message: "Este usuário não pode ser deletado" });
        }
        await User.findByIdAndDelete(req.params.id);
        
        return res.status(200).send({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
        return res.status(500).send({ message: `${error.message} - erro ao deletar usuário` });
    }
});


router.put("/:id",async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id,req.body);
        if (!user) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }
        return res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
        res.status(501).send({message: `${error.message} - erro ao cadastrar usuário`})
    }
});
router.post("/login",async (req, res) => {
    try {
        const LoginData = req.body;
       
        if(LoginData.email === ''){
            return res.status(404).send({ message: "Email não informado" });
        };
        const userFinded = await User.findOne({email: LoginData.email})
        console.log(userFinded);
        if(!userFinded){
            return res.status(404).send({ message: "Usuário não encontrado" });
        }
        const token = jwt.sign({email:userFinded.email, name:userFinded.name, age:userFinded.age},'ava@2020',{expiresIn: '1h'})
        return res.status(200).json(token);
    } catch (error) {
        res.status(501).send({message: `${error.message} - erro ao autenticar usuário`})
    }
});
router.get("/me",verifyToken, async (req, res) => {
    try {
        const me = await User.findOne({email: req.email});
        return res.status(200).json(me);
    } catch (error) {
        res.status(500).send({message: `${error.message} - erro ao procurar usuário`})
    }
    
});
module.exports = router;