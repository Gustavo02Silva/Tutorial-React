import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const token = localStorage.getItem('token');
  const url = "http://localhost:8000";

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${url}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  };

  const sendPost = async () => {
    if (title.trim() !== '' && text.trim() !== '') {
      const currentDate = new Date().toISOString(); // formato aceito pelo FastAPI
      try {
        await axios.post(`${url}/posts`, {
          title,
          text,
          date: currentDate,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle('');
        setText('');
        fetchPosts();
      } catch (error) {
        console.error('Erro ao enviar post:', error);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Novo Post</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
      />
      <br />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escreva seu post aqui"
      />
      <br />
      <button onClick={sendPost}>Enviar</button>

      <h2>Posts</h2>
      <ul>
        {posts.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.title}</strong> — {msg.text} <br />
            <small>{new Date(msg.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
