const express = require('express')
const app = express()

const mariadb = require('mariadb')
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tareas',
})

const PORT = process.env.PORT ?? 3000

app.use(express.json())

// Trae todas las tareas
app.get('/tareas', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    // Realizo la consulta a la base de datos
    const rows = await conn.query('SELECT id, titulo, completado FROM tareas')

    // Finalizo y entrego una respuesta al usuario
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'El servidor se ha caído' })
  } finally {
    if (conn) conn.release()
  }
})

// Trae una tarea por ID
app.get('/tareas/:id', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    // Realizo la consulta a la base de datos
    const rows = await conn.query(
      'SELECT id, titulo, completado FROM tareas WHERE id = ?',
      [req.params.id]
    )
    // Finalizo y entrego una respuesta al usuario
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'El servidor se ha caído' })
  } finally {
    if (conn) conn.release()
  }
})

// Agregar nueva tarea
app.post('/tareas', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    // Realizo la consulta a la base de datos
    const result = await conn.query('INSERT INTO tareas(titulo) VALUES (?)', [
      req.body.titulo,
    ])

    // Finalizo y entrego una respuesta al usuario
    res.send('Tarea insertada')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'El servidor se ha caído' })
  } finally {
    if (conn) conn.release()
  }
})

// Modificar una tarea
app.patch('/tareas/:id', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    // Realizo la consulta a la base de datos
    const result = await conn.query(
      `UPDATE tareas SET completado=? WHERE id=?`,
      [req.body.completado, req.params.id]
    )

    // Finalizo y entrego una respuesta al usuario
    res.send('Tarea actualizada')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'El servidor se ha caído' })
  } finally {
    if (conn) conn.release()
  }
})

// Eliminar una tarea
app.delete('/tareas/:id', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    // Realizo la consulta a la base de datos
    const result = await conn.query(`DELETE FROM tareas WHERE id=?`, [
      req.params.id,
    ])

    // Finalizo y entrego una respuesta al usuario
    res.send('Tarea eliminada')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'El servidor se ha caído' })
  } finally {
    if (conn) conn.release()
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
