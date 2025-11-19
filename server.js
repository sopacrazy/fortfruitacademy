import "dotenv/config";
import express from "express";
import mysql from "mysql2/promise"; // Usando versão com Promises para facilitar
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

// 2. Buscar TUDO (Módulos + Vídeos + Documentos)
app.get("/modules", async (req, res) => {
  try {
    // Busca dados das 3 tabelas
    const [modules] = await pool.query("SELECT * FROM modules");
    const [videos] = await pool.query("SELECT * FROM videos");
    const [documents] = await pool.query("SELECT * FROM documents");

    // Monta a estrutura JSON que o Frontend espera (Aninhada)
    const fullData = modules.map((mod) => ({
      ...mod,
      videos: videos.filter((v) => v.module_id === mod.id),
      documents: documents.filter((d) => d.module_id === mod.id),
    }));

    res.json(fullData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar módulos");
  }
});

// 3. Adicionar Conteúdo (Vídeo ou Documento)
app.post("/content", async (req, res) => {
  const { moduleId, type, data } = req.body;

  try {
    if (type === "video") {
      await pool.query(
        "INSERT INTO videos (module_id, title, description, duration, thumbnail_url, video_url) VALUES (?, ?, ?, ?, ?, ?)",
        [
          moduleId,
          data.title,
          data.description,
          data.duration,
          data.thumbnailUrl,
          data.videoUrl,
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
