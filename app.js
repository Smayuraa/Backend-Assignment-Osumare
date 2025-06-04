const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let itemList = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const searchQuery = req.query.search?.toLowerCase() || '';
  const filteredItems = itemList.filter(item => item.text.toLowerCase().includes(searchQuery));
  res.render('index', { items: filteredItems, searchQuery, editIndex: null });
});

app.post('/add', (req, res) => {
  const itemText = req.body.item;
  if (itemText) {
    const newItem = {
      text: itemText,
      completed: false,
      date: new Date().toLocaleString()
    };
    itemList.push(newItem);
  }
  res.redirect('/');
});

app.post('/delete', (req, res) => {
  const index = parseInt(req.body.index);
  if (!isNaN(index) && index >= 0 && index < itemList.length) {
    itemList.splice(index, 1);
  }
  res.redirect('/');
});

app.post('/edit', (req, res) => {
  const index = parseInt(req.body.index);
  if (!isNaN(index)) {
    const searchQuery = '';
    res.render('index', { items: itemList, searchQuery, editIndex: index });
  } else {
    res.redirect('/');
  }
});

app.post('/update', (req, res) => {
  const index = parseInt(req.body.index);
  const updatedText = req.body.updatedItem;
  if (!isNaN(index) && updatedText) {
    itemList[index].text = updatedText;
  }
  res.redirect('/');
});

app.post('/toggle', (req, res) => {
  const index = parseInt(req.body.index);
  if (!isNaN(index)) {
    itemList[index].completed = !itemList[index].completed;
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
