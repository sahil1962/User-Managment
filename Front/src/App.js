import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error('Error fetching users:',  err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addUser = () => {
    // Check if the email already exists
    const emailExists = users.some(user => user.email === formData.email);
    if (emailExists) {
      setError('Email already exists!');
    } else {
      //clean form data
      setError('');

      axios.post('http://localhost:5000/api/users', formData)
        .then(res => {
          setUsers([...users, res.data]);
          setFormData({ name: '', email: '', role: '' });
        })
        .catch(err => {
          console.error('Error adding user:', err);
        });
    }
  };

  const deleteUser = (email) => {
    axios.delete(`http://localhost:5000/api/users/${email}`)
      .then(() => {
        setUsers(users.filter(user => user.email !== email));
      })
      .catch(err => {
        console.error('Error deleting user:', err);
      });
  };

  return (
    <div className="container">
      <h1>User Management</h1>
      {error && <div className="error">{error}</div>}
      <div>
        <h2>Add User</h2>
        <form>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
          <input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleInputChange} />
          <button type="button" onClick={addUser}>Add User</button>
        </form>
      </div>
      <div>
        <h2>User List</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.name} - {user.email} - {user.role}
              <button onClick={() => deleteUser(user.email)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
