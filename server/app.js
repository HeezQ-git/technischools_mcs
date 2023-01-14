const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const checkToken = require('./src/middlewares/checkToken');
const authApi = require('./src/services/auth/auth.route');
const usersApi = require('./src/services/users/users.route');
const groupsApi = require('./src/services/groups/groups.route');
const messagesApi = require('./src/services/messages/messages.route');
const adminApi = require('./src/services/admin/admin.route');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(authApi);
app.use(checkToken);
app.use(usersApi);
app.use(groupsApi);
app.use(messagesApi);
app.use(adminApi)
const PORT = 60987;

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server up and running on port ${process.env.PORT || PORT}`);
});