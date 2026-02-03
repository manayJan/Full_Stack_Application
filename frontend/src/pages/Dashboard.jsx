import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, 
  FaSearch, 
  FaSignOutAlt, 
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaEdit,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTimes,
  FaUserCircle,
  FaChartLine,
  FaBell,
  FaCheck,
  FaExclamationCircle,
  FaCalendarDay
} from "react-icons/fa";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import "./Dashboard.css";

export default function Dashboard({ user, onLogout }) {  // Accept props from parent
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });

  const api = axios.create({ 
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/todos");
      setTodos(res.data);
      updateStats(res.data);
    } catch (err) {
      console.error("Failed to fetch todos", err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (todoList) => {
    const total = todoList.length;
    const completed = todoList.filter(t => t.completed).length;
    const pending = todoList.filter(t => !t.completed).length;
    const overdue = todoList.filter(t => 
      !t.completed && t.dueDate && isPast(parseISO(t.dueDate))
    ).length;
    
    setStats({ total, completed, pending, overdue });
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      const newTodo = { 
        title, 
        description, 
        dueDate: dueDate || undefined,
        priority
      };
      
      const res = await api.post("/todos", newTodo);
      setTodos((s) => [res.data, ...s]);
      updateStats([res.data, ...todos]);
      
      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add todo", err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await api.put(`/todos/${id}`, { completed: !completed });
      const updated = todos.map((t) => 
        t._id === id ? { ...t, completed: !completed } : t
      );
      setTodos(updated);
      updateStats(updated);
    } catch (err) {
      console.error("Failed to update todo", err);
    }
  };

  const removeTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;
    
    try {
      await api.delete(`/todos/${id}`);
      const updated = todos.filter((t) => t._id !== id);
      setTodos(updated);
      updateStats(updated);
    } catch (err) {
      console.error("Failed to delete todo", err);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditDueDate(todo.dueDate || "");
  };

  const saveEdit = async (id) => {
    try {
      const updated = { 
        title: editTitle, 
        description: editDescription, 
        dueDate: editDueDate || undefined 
      };
      
      await api.put(`/todos/${id}`, updated);
      const updatedTodos = todos.map((t) => 
        t._id === id ? { ...t, ...updated } : t
      );
      setTodos(updatedTodos);
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update todo", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditDueDate("");
  };

  const getDueDateStatus = (date) => {
    if (!date) return null;
    const parsed = parseISO(date);
    if (isToday(parsed)) return "today";
    if (isTomorrow(parsed)) return "tomorrow";
    if (isPast(parsed)) return "overdue";
    return "future";
  };

  const filteredTodos = todos.filter(todo => {
    const matchesQuery = !query || 
      todo.title.toLowerCase().includes(query.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(query.toLowerCase()));
    
    const matchesFilter = filter === "all" ||
      (filter === "completed" && todo.completed) ||
      (filter === "pending" && !todo.completed) ||
      (filter === "overdue" && !todo.completed && todo.dueDate && isPast(parseISO(todo.dueDate)));
    
    return matchesQuery && matchesFilter;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "date":
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
        comparison = dateA - dateB;
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
        break;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const clearAllCompleted = async () => {
    if (!window.confirm("Delete all completed tasks?")) return;
    
    try {
      const completedIds = todos.filter(t => t.completed).map(t => t._id);
      await Promise.all(completedIds.map(id => api.delete(`/todos/${id}`)));
      const updated = todos.filter(t => !t.completed);
      setTodos(updated);
      updateStats(updated);
    } catch (err) {
      console.error("Failed to clear completed", err);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header - Design remains exactly the same */}
      <header className="dashboard-header">
        <div className="header-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="brand-section"
          >
            <h1 className="dashboard-title">
              Task<span className="gradient-text">Flow</span>
            </h1>
            <p className="dashboard-subtitle">Your productivity companion</p>
          </motion.div>

          <div className="header-controls">
            <motion.div 
              className="search-container"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks..."
                className="search-input"
              />
            </motion.div>

            {user && (
              <motion.div 
                className="user-profile"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                ) : (
                  <FaUserCircle className="user-icon" />
                )}
                <span className="user-name">{user.name || user.email}</span>
              </motion.div>
            )}

            <motion.button
              onClick={onLogout}  // Use passed logout function
              className="logout-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card total"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats.total}</p>
          <div className="stat-trend">All activities</div>
        </motion.div>

        <motion.div 
          className="stat-card completed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaCheckCircle className="stat-icon" />
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
          <div className="stat-trend">
            {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% done` : "No tasks"}
          </div>
        </motion.div>

        <motion.div 
          className="stat-card pending"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FaClock className="stat-icon" />
          <h3>Pending</h3>
          <p className="stat-number">{stats.pending}</p>
          <div className="stat-trend">Need attention</div>
        </motion.div>

        <motion.div 
          className="stat-card overdue"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FaExclamationCircle className="stat-icon" />
          <h3>Overdue</h3>
          <p className="stat-number">{stats.overdue}</p>
          <div className="stat-trend">Urgent tasks</div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="sidebar">
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="add-todo-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus />
            <span>New Task</span>
          </motion.button>

          <div className="filters-section">
            <h3 className="section-title">
              <FaFilter className="section-icon" />
              Filters
            </h3>
            {["all", "pending", "completed", "overdue"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`filter-btn ${filter === filterOption ? "active" : ""}`}
              >
                <span className="filter-dot" data-type={filterOption} />
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                {filterOption === "overdue" && stats.overdue > 0 && (
                  <span className="badge">{stats.overdue}</span>
                )}
              </button>
            ))}
          </div>

          <div className="sort-section">
            <h3 className="section-title">
              <FaSortAmountDown className="section-icon" />
              Sort By
            </h3>
            <div className="sort-options">
              {["date", "title", "priority"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`sort-btn ${sortBy === option ? "active" : ""}`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
              <button onClick={toggleSortOrder} className="sort-order-btn">
                {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>

          {stats.completed > 0 && (
            <motion.button
              onClick={clearAllCompleted}
              className="clear-completed-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrash />
              <span>Clear Completed</span>
              <span className="badge">{stats.completed}</span>
            </motion.button>
          )}
        </div>

        <div className="main-content">
          {/* Add Todo Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                className="add-todo-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="form-header">
                  <h3>Add New Task</h3>
                  <button onClick={() => setShowForm(false)} className="close-btn">
                    <FaTimes />
                  </button>
                </div>
                
                <form onSubmit={addTodo}>
                  <div className="form-group">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Task title"
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description (optional)"
                      className="form-textarea"
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaCalendarDay className="input-icon" />
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Priority</label>
                      <div className="priority-selector">
                        {["low", "medium", "high"].map((level) => (
                          <button
                            key={level}
                            type="button"
                            className={`priority-btn ${priority === level ? "active" : ""}`}
                            data-priority={level}
                            onClick={() => setPriority(level)}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      <FaPlus />
                      Add Task
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Todos List */}
          <div className="todos-section">
            <div className="section-header">
              <h2>My Tasks</h2>
              <div className="tasks-count">
                {filteredTodos.length} task{filteredTodos.length !== 1 ? 's' : ''}
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading your tasks...</p>
              </div>
            ) : sortedTodos.length > 0 ? (
              <AnimatePresence>
                <div className="todos-list">
                  {sortedTodos.map((todo, index) => (
                    <motion.div
                      key={todo._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className={`todo-card ${todo.completed ? "completed" : ""}`}
                      data-priority={todo.priority || "medium"}
                    >
                      {editingId === todo._id ? (
                        <div className="edit-form">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="edit-input"
                            autoFocus
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="edit-textarea"
                            placeholder="Description"
                          />
                          <div className="edit-actions">
                            <button onClick={() => saveEdit(todo._id)} className="save-btn">
                              <FaCheck /> Save
                            </button>
                            <button onClick={cancelEdit} className="cancel-btn">
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="todo-main">
                            <button
                              onClick={() => toggleComplete(todo._id, todo.completed)}
                              className={`complete-btn ${todo.completed ? "checked" : ""}`}
                              aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                            >
                              {todo.completed && <FaCheck />}
                            </button>
                            
                            <div className="todo-content">
                              <div className="todo-header">
                                <h4 className={`todo-title ${todo.completed ? "completed" : ""}`}>
                                  {todo.title}
                                </h4>
                                <span className={`priority-badge ${todo.priority || "medium"}`}>
                                  {todo.priority || "medium"}
                                </span>
                              </div>
                              
                              {todo.description && (
                                <p className="todo-description">{todo.description}</p>
                              )}
                              
                              <div className="todo-footer">
                                {todo.dueDate && (
                                  <div className={`due-date ${getDueDateStatus(todo.dueDate)}`}>
                                    <FaCalendarAlt />
                                    <span>
                                      {getDueDateStatus(todo.dueDate) === "today" && "Today"}
                                      {getDueDateStatus(todo.dueDate) === "tomorrow" && "Tomorrow"}
                                      {getDueDateStatus(todo.dueDate) === "overdue" && "Overdue"}
                                      {getDueDateStatus(todo.dueDate) === "future" && format(parseISO(todo.dueDate), "MMM d")}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="todo-actions">
                                  <button
                                    onClick={() => startEditing(todo)}
                                    className="action-btn edit"
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => removeTodo(todo._id)}
                                    className="action-btn delete"
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            ) : (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="empty-illustration">
                  <FaCheckCircle />
                </div>
                <h3>No tasks found</h3>
                <p>
                  {query ? "Try a different search term" : "Get started by adding a new task!"}
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="add-first-btn"
                >
                  <FaPlus /> Add Your First Task
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}