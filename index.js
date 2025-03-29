var express = require('express');
var mongoose = require('mongoose');
const uri = "mongodb+srv://Avallone:Avallone13@elv-quiz.aog4i.mongodb.net/?retryWrites=true&w=majority&appName=minha-api";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');

var app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
var PORT = 3030;

app.listen(PORT,() => {
    console.log('Servidor rodando na porta 3030')
})

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro ao conectar'));
db.once('open', function(){
    console.log('Conectado ao banco com sucesso');
})