const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5000;


app.use(cors());

app.use(bodyParser.json());

let users = []; // Store users in memory

// request to fetch users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// request to add new users
app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;

  // email validation
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const newUser = { name, email, role };
  users.push(newUser);

  console.log('New user added:', newUser);
  res.status(201).json(newUser);
});

// delete user by email
app.delete('/api/users/:email', (req, res) => {
  const { email } = req.params;

  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
