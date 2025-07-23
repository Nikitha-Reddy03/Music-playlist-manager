const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const url = 'mongodb://localhost:27017';
const dbName = 'musicdb';
let db;

MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  })
  .catch(error => console.error(error));

// Create - Add a song
app.post('/songs', async (req, res) => {
  try {
    const song = req.body;
    const result = await db.collection('songs').insertOne(song);
    res.status(201).json({ message: 'Song added', songId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding song', error });
  }
});

// Read - Get all songs
app.get('/songs', async (req, res) => {
  try {
    const songs = await db.collection('songs').find().toArray();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching songs', error });
  }
});

// Read - Get single song
app.get('/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const song = await db.collection('songs').findOne({ _id: new ObjectId(id) });
    if (song) {
      res.status(200).json(song);
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching song', error });
  }
});

// Update - Edit song
app.put('/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSong = req.body;
    delete updatedSong._id;
    const result = await db.collection('songs').updateOne({ _id: new ObjectId(id) }, { $set: updatedSong });
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Song updated' });
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating song', error });
  }
});

// Delete - Remove song
app.delete('/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('songs').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Song deleted' });
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting song', error });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
