const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3000;

app.get('/producto', async (req, res) => {
  const codigo = req.query.codigo?.trim();

  if (!codigo || codigo.length !== 13 || !/^\d+$/.test(codigo)) {
    return res.status(400).json({ status: 400, mensaje: 'Código inválido. Debe tener 13 dígitos numéricos' });
  }

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'pos'
    });

    const [rows] = await connection.execute(
      `SELECT producto_nombre AS nombre, producto_precio AS precio, producto_imagen AS imagen
        FROM productos
        WHERE producto_codigo = ?`,
      [codigo]
    );

    await connection.end();

    if (rows.length > 0) {
      return res.status(200).json({ status: 200, mensaje: 'Producto encontrado', data: rows[0] });
    } else {
      return res.status(404).json({ status: 404, mensaje: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, mensaje: 'Error en el servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
