const db = require('./db');
const { Request, Response, NextFunction } = require('express');


// Middleware de Validação ou seja
exports.validarProduto = (req, res, next) => {
    const { nome, sku, quantidade, categoria, preco } = req.body;
    
    if (!nome || !sku || quantidade === undefined || !categoria || preco === undefined) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome, sku, quantidade, categoria, preco.' });
    }

    if (preco < 0 || quantidade < 0) {
        return res.status(400).json({ error: 'Preço e quantidade devem ser valores positivos.' });
    }

    next();
};

// Listar Produtos
exports.listarProdutos = (req, res) => {
    const { categoria } = req.query;
    let sql = 'SELECT * FROM produtos';
    const params = [];

    if (categoria) {
        sql += ' WHERE categoria = ?';
        params.push(categoria);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};


// Criar Produto


exports.criarProduto = (req, res) => {
    const { nome, sku, quantidade, categoria, preco } = req.body;
    const sql = 'INSERT INTO produtos (nome, sku, quantidade, categoria, preco) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [nome, sku, quantidade, categoria, preco], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Produto criado!', id: result.insertId });
    });
};

// Atualizar Produto
exports.atualizarProduto = (req, res) => {
    const { id } = req.params;
    const { nome, sku, quantidade, categoria, preco } = req.body;
    const sql = 'UPDATE produtos SET nome = ?, sku = ?, quantidade = ?, categoria = ?, preco = ? WHERE id = ?';

    db.query(sql, [nome, sku, quantidade, categoria, preco, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto atualizado com sucesso!' });
    });
};

// Deletar Produto
exports.deletarProduto = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM produtos WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado para deletar' });
        }
        res.json({ message: 'Produto removido com sucesso!' });
    });
};