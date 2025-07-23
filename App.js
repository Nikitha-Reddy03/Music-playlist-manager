// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/songs";

function App() {
  const [songs, setSongs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    artist: "",
    album: "",
    duration: "",
    playlist: "",
    link: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setSongs(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: "", artist: "", album: "", duration: "", playlist: "", link: "" });
    fetchSongs();
  };

  const handleEdit = (song) => {
    setForm(song);
    setEditId(song._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchSongs();
    }
  };

  return (
    <div className="App">
      <h1>🎵 Music Playlist Manager</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Song Name" value={form.name} onChange={handleChange} required />
        <input name="artist" placeholder="Artist" value={form.artist} onChange={handleChange} required />
        <input name="album" placeholder="Album" value={form.album} onChange={handleChange} required />
        <input name="duration" placeholder="Duration" value={form.duration} onChange={handleChange} />
        <input name="playlist" placeholder="Playlist" value={form.playlist} onChange={handleChange} />
        <input name="link" placeholder="Spotify Link" value={form.link} onChange={handleChange} />
        <button type="submit">{editId ? "Update" : "Add"} Song</button>
      </form>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Duration</th>
            <th>Playlist</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song._id}>
              <td>{song.name || song.title}</td>
              <td>{song.artist}</td>
              <td>{song.album}</td>
              <td>{song.duration}</td>
              <td>{song.playlist}</td>
              <td>
                {song.link ? (
                  <a href={song.link} target="_blank" rel="noreferrer">
                    Listen
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(song)}>Edit</button>
                <button onClick={() => handleDelete(song._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
