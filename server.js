const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb+srv://tasur:Dzirciema93@cluster0-pnv4h.gcp.mongodb.net/test?retryWrites=true&w=majority";

// connects our back end code with the database
mongoose.connect(dbRoute)
  .then(() => console.log('connected to the database'))
  .catch(err => console.error('MongoDB connection error:', err));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/getData', async (req, res) => {
  try {
    const data = await Data.find();
    console.log(data);
    console.log(`getData is here`);
    return res.json({ success: true, data: data });
  } catch (err) {
    return res.json({ success: false, error: err });
  }
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', async (req, res) => {
  const { id, update } = req.body;
  try {
    await Data.findByIdAndUpdate(id, update);
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, error: err });
  }
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', async (req, res) => {
  const { id } = req.body;
  try {
    await Data.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// this is our create method
// this method adds new data in our database
router.post('/putData', async (req, res) => {
  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }

  let data = new Data();
  data.message = message;
  data.id = id;

  try {
    await data.save();
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, error: err });
  }
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
