require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env (segurança)
const express = require('express');
const cors = require('cors');
const authRoutes = require('./authRoutes'); // Importa rotas de autenticação
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const produtoRoutes = require('./produtoRoutes'); // Importa as rotas
 
const app = express();
app.use(express.json()); // Para o servidor entender JSON
app.use(cors());

// --- 2. CONFIGURAÇÃO DO SWAGGER ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Controle de Estoque',
            version: '1.0.0',
            description: 'API para gerenciar produtos e estoque',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./*.js'], // Swagger agora lê os arquivos na raiz
};

const specs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// --- 3. ROTAS ---
app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Verifica se a API está online
 *     responses:
 *       200:
 *         description: Sucesso
 */
app.get('/status', (req, res) => {
    res.send('API de Estoque rodando perfeitamente!');
});

// --- 4. INICIAR O SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});
