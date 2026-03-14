const express = require('express');

const router = express.Router();
const produtoController = require('./produtoController');
const authController = require('./authController');

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Retorna a lista de produtos, com opção de filtro por categoria
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtra os produtos pela categoria informada
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/', produtoController.listarProdutos);

/**
 * @swagger
 * /produtos:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Cadastra um novo produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sku:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *               categoria:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       500:
 *         description: Erro ao criar produto
 */
router.post('/', authController.verificarToken, produtoController.validarProduto, produtoController.criarProduto);

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Atualiza um produto existente pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sku:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *               categoria:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', authController.verificarToken, produtoController.validarProduto, produtoController.atualizarProduto);


/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove um produto pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser deletado
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', authController.verificarToken, produtoController.deletarProduto);


module.exports = router;