const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ← Faltava essa linha

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.send('Servidor DowndFaby está online! 🚀');
});

// Modelo de usuário
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}));

// Rota de registro
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

// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Senha incorreta' });

  const token = jwt.sign({ id: user._id }, 'secreto', { expiresIn: '1d' });
  res.json({ message: 'Login realizado com sucesso', token });
});

// Porta dinâmica
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🟢 Conectado ao MongoDB'))
.catch(err => {
  console.error('🔴 Erro ao conectar no MongoDB:', err.message);
});


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pedrohenriqueantunesleite579_db_user:<db_password>@cluster0.mphkoir.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
