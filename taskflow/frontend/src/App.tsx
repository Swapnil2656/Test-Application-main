import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// --- Auth Context & Hook (Simplified for this test app) ---
const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return { token, setToken, isAuthenticated: !!token };
};

// --- Pages ---
const Login = ({ setToken }: { setToken: (token: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to TaskFlow</h2>
        <form onSubmit={handleSubmit}>
          <input className="w-full mb-4 p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full mb-6 p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" type="submit">Login</button>
        </form>
        <p className="mt-4 text-sm text-center">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link></p>
      </div>
    </div>
  );
};

const Register = ({ setToken }: { setToken: (token: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register for TaskFlow</h2>
        <form onSubmit={handleSubmit}>
          <input className="w-full mb-4 p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full mb-6 p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700" type="submit">Register</button>
        </form>
        <p className="mt-4 text-sm text-center">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
      </div>
    </div>
  );
};

const Dashboard = ({ token, setToken }: { token: string | null, setToken: (token: string | null) => void }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    const res = await fetch(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setProjects(await res.json());
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: newTitle }),
    });
    setNewTitle('');
    fetchProjects();
  };

  const deleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault(); // prevent navigation
    if (!confirm('Are you sure you want to delete this project?')) return;
    await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Projects Dashboard</h1>
          <button onClick={() => setToken(null)} className="text-red-600 hover:underline">Logout</button>
        </div>
        
        <form onSubmit={createProject} className="mb-8 flex gap-4">
          <input 
            className="flex-1 p-3 border rounded shadow-sm" 
            value={newTitle} 
            onChange={e => setNewTitle(e.target.value)} 
            placeholder="New Project Title" 
            required 
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700" type="submit">Create</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <Link to={`/project/${p.id}`} key={p.id} className="block p-6 bg-white rounded shadow hover:shadow-md transition relative pr-12">
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-gray-600 text-sm">{p._count.tasks} tasks total</p>
              <button 
                onClick={(e) => deleteProject(e, p.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold p-2"
                title="Delete project"
              >
                ✕
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectDetails = ({ token }: { token: string | null }) => {
  const [project, setProject] = useState<any>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const id = window.location.pathname.split('/').pop();

  useEffect(() => {
    fetchProject();
  }, [id, token]);

  const fetchProject = async () => {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setProject(await res.json());
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_URL}/projects/${id}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: newTaskTitle }),
    });
    setNewTaskTitle('');
    fetchProject();
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    await fetch(`${API_URL}/projects/${id}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchProject();
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    await fetch(`${API_URL}/projects/${id}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProject();
  };

  if (!project) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
        </div>
        
        <form onSubmit={createTask} className="mb-8 flex gap-4">
          <input 
            className="flex-1 p-3 border rounded shadow-sm" 
            value={newTaskTitle} 
            onChange={e => setNewTaskTitle(e.target.value)} 
            placeholder="New Task Title" 
            required 
          />
          <button className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700" type="submit">Add Task</button>
        </form>

        <div className="space-y-4">
          {project.tasks.map((t: any) => (
            <div key={t.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <span className={`flex-1 ${t.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {t.title}
              </span>
              <select 
                value={t.status}
                onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                className="border p-2 rounded ml-4 bg-gray-50"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button 
                onClick={() => deleteTask(t.id)}
                className="ml-4 text-red-500 hover:text-red-700 font-bold px-2"
                title="Delete task"
              >
                ✕
              </button>
            </div>
          ))}
          {project.tasks.length === 0 && <p className="text-gray-500 text-center">No tasks yet.</p>}
        </div>
      </div>
    </div>
  );
};

// --- App Root ---
function App() {
  const { token, setToken, isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setToken={setToken} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register setToken={setToken} />} />
        <Route path="/" element={isAuthenticated ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" />} />
        <Route path="/project/:id" element={isAuthenticated ? <ProjectDetails token={token} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
