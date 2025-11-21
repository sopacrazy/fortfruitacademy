// /server.js

import "dotenv/config";
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do Banco (Pool de conexões)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --- ROTAS ---

// 1. Login (Mantido)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    if (rows.length > 0) {
      const user = rows[0];
      res.send({ success: true, user: user.username, role: user.role });
    } else {
      res.status(401).send({ message: "Credenciais inválidas" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 2. Buscar TUDO (Módulos + Vídeos + Documentos) - ATUALIZADO (Inclui Categoria e Mapeamento)
app.get("/modules", async (req, res) => {
  try {
    const [modules] = await pool.query("SELECT * FROM modules");
    const [videos] = await pool.query("SELECT * FROM videos");
    const [documents] = await pool.query("SELECT * FROM documents");

    // Mapeamento dos vídeos (snake_case -> camelCase e inclui category)
    const mappedVideos = videos.map((v) => ({
      id: v.id,
      module_id: v.module_id,
      title: v.title,
      description: v.description,
      duration: v.duration,
      category: v.category, // Mapeado
      thumbnailUrl: v.thumbnail_url,
      videoUrl: v.video_url,
    }));

    // Mapeamento dos documentos
    const mappedDocuments = documents.map((d) => ({
      id: d.id,
      module_id: d.module_id,
      title: d.title,
      type: d.type,
      url: d.url,
    }));

    // Monta a estrutura JSON aninhada para o Frontend
    const fullData = modules.map((mod) => ({
      ...mod,
      videos: mappedVideos.filter((v) => v.module_id === mod.id),
      documents: mappedDocuments.filter((d) => d.module_id === mod.id),
    }));

    res.json(fullData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar módulos");
  }
});

// 3. Adicionar Conteúdo (Vídeo ou Documento) - ATUALIZADO (Inclui Categoria)
app.post("/content", async (req, res) => {
  const { moduleId, type, data } = req.body;

  try {
    if (type === "video") {
      await pool.query(
        "INSERT INTO videos (module_id, title, description, duration, thumbnail_url, video_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          moduleId,
          data.title,
          data.description,
          data.duration,
          data.thumbnailUrl,
          data.videoUrl,
          data.category,
        ]
      );
    } else {
      await pool.query(
        "INSERT INTO documents (module_id, title, type, url) VALUES (?, ?, ?, ?)",
        [moduleId, data.title, data.type, data.url]
      );
    }
    res.send({ success: true, message: "Conteúdo adicionado!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro ao salvar conteúdo" });
  }
});

// 4. NOVA ROTA: ADICIONAR NOVO USUÁRIO (Apenas admin deve usar!)
app.post("/users", async (req, res) => {
  const { username, password, role } = req.body;

  // Validação simples de dados
  if (!username || !password || !role) {
    return res
      .status(400)
      .send({ success: false, message: "Campos obrigatórios faltando." });
  }

  try {
    // 1. Verificar se o usuário já existe
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res
        .status(409)
        .send({ success: false, message: "Usuário já existe." });
    }

    // 2. Inserir novo usuário
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role]
    );

    res.send({
      success: true,
      message: `Usuário ${username} criado com sucesso!`,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res
      .status(500)
      .send({ success: false, error: "Erro interno ao criar usuário." });
  }
});

// /server.js - ADICIONE ESTA ROTA
// 5. NOVA ROTA: EXCLUIR CONTEÚDO (Vídeo ou Documento)
app.delete("/content/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  try {
    let tableName;
    if (type === "video") {
      tableName = "videos";
    } else if (type === "document") {
      tableName = "documents";
    } else {
      return res
        .status(400)
        .send({ success: false, message: "Tipo de conteúdo inválido." });
    }

    const [result] = await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Conteúdo não encontrado." });
    }

    res.send({ success: true, message: "Conteúdo excluído com sucesso!" });
  } catch (error) {
    console.error(`Erro ao excluir ${type}:`, error);
    res
      .status(500)
      .send({ success: false, error: "Erro interno ao excluir conteúdo." });
  }
});

const PORT = (process.env.PORT = 3005);
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
