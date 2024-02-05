const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
app.use(express.static("public"));
// Set a higher payload size limit (e.g., 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


require('./config/database');
app.use(cors());
app.use(bodyParser.json());


app.use('/user', require('./routes/users.routes'));
app.use('/login', require('./routes/auth/login.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/reception', require('./routes/reception.routes'));
app.use('/pharmacy', require('./routes/pharmacy.routes'));
app.use('/doctor', require('./routes/doctor.routes'));


app.listen(3000, () => {
console.log('Server started on port 3000');
});