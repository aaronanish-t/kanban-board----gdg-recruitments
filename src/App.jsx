import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('kanban-final-v4');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Project Research', status: 'todo' },
      { id: 2, title: 'Database Schema', status: 'in-progress' },
      { id: 3, title: 'Initial Deployment', status: 'done' },
    ];
  });
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('kanban-theme') === 'dark';
  });

  
  useEffect(() => {
    localStorage.setItem('kanban-final-v4', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kanban-theme', isDarkMode ? 'dark' : 'light');
    document.body.className = isDarkMode ? 'dark-mode' : '';
  }, [isDarkMode]);

  
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = { id: Date.now(), title: newTaskTitle, status: 'todo' };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
    }
  };

  
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("taskId", id);
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, newStatus) => {
    const id = e.dataTransfer.getData("taskId");
    const updatedTasks = tasks.map(task => {
      if (task.id.toString() === id) {
        return { ...task, status: newStatus };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  return (
    <div className="app-container">
      <header>
        <div className="header-left">
          <h1>Kanban Board</h1>
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        
        <div className="add-task-container">
          <input 
            type="text" 
            placeholder="+ Quick add..." 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTask();
              if (e.key === 'Escape') setNewTaskTitle('');
            }}
          />
          <button className="add-btn" onClick={addTask}>Add Task</button>
          <button className="clear-btn" onClick={clearAll} title="Clear Board">🗑️</button>
        </div>
      </header>

      <main className="board">
        {['todo', 'in-progress', 'done'].map((status) => (
          <div 
            key={status} 
            className="column" 
            data-status={status}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
          >
            <div className="column-header">
              <span className="column-title">{status.replace('-', ' ')}</span>
              <span className="count-badge">{getTasksByStatus(status).length}</span>
            </div>
            
            <div className="task-list">
              {getTasksByStatus(status).map((task) => (
                <div 
                  key={task.id} 
                  className="task-card"
                  draggable
                  onDragStart={(e) => onDragStart(e, task.id)}
                >
                  <span className="task-title">{task.title}</span>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                    ✕
                  </button>
                </div>
              ))}
              {getTasksByStatus(status).length === 0 && (
                <div className="empty-message">No tasks here</div>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
