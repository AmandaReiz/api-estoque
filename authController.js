const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_senha_secreta_super_segura';


// Registrar novo usuário
exports.registrar = (req, res) => {
    const { email, senha } = req.body;
 
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Criptografa a senha antes de salvar
    const senhaHash = bcrypt.hashSync(senha, 10);

    const sql = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
    db.query(sql, [email, senhaHash], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    });
};

// Login
exports.login = (req, res) => {
    const { email, senha } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'Email ou senha incorretos' });

        const usuario = results[0];
        
        // Verifica se a senha bate com a criptografada no banco
        const senhaValida = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ error: 'Email ou senha incorretos' });

        // Gera o Token JWT
 const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    });
};

// Middleware para proteger rotas
exports.verificarToken = (req, res, next) => {
 const tokenHeader = req.headers['authorization'];
    
    // O token geralmente vem como "Bearer <TOKEN>", precisamos pegar só a parte do token
    if (!tokenHeader) return res.status(403).json({ error: 'Token não fornecido' });

    const token = tokenHeader.split(' ')[1]; // Remove a palavra 'Bearer'

 if (!token) return res.status(403).json({ error: 'Formato de token inválido' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido ou expirado' });
        
        req.usuarioId = decoded.id;
        next();
    });
};