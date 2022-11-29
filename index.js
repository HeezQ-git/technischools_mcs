const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const checkToken = require('./backend/middlewares/checkToken');
const loginApi = require('./backend/backoffice/login');
const usersApi = require('./backend/backoffice/users');
const groupsApi = require('./backend/backoffice/groups');
const messagesApi = require('./backend/backoffice/messages');

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(loginApi);
app.use(checkToken);
app.use(usersApi);
app.use(groupsApi);
app.use(messagesApi);

const PORT = 8080;

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server up and running on port ${process.env.PORT || PORT}`);
});