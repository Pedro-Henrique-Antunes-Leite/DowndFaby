const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/downdfaby', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}));

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    const user = await User.create({ name, email, password: hashedPassword });
    res.json({ message: 'Usuário criado com sucesso', user });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar usuário' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Senha incorreta' });

  const token = jwt.sign({ id: user._id }, 'secreto', { expiresIn: '1d' });
  res.json({ message: 'Login realizado com sucesso', token });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
