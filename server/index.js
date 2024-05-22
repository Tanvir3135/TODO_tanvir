require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use(cors());

const { query } = require('./helpers/db');

app.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM task');
    const tasks = result.rows.length > 0 ? result.rows : [];
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

app.post('/', async (req, res) => {
  const { description } = req.body;
  try {
    const result = await query('INSERT INTO task (description) VALUES ($1) RETURNING *', [description]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving task' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await query('DELETE FROM task WHERE id = $1', [id]);
    res.json({ message: `Task with id ${id} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    client.query('DELETE FROM task WHERE id = $1', [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting task' });
      } else {
        res.json({ message: `Task with id ${id} deleted successfully` });
      }
    });
  });

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });