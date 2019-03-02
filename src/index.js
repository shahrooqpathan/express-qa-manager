//importing all required dependencies

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

//defining an express app

const app = express();

//database for questions
const questions = [];

//Security
app.use(helmet());

//json parser
app.use(bodyParser.json());

//enabling Cross origin requests 
app.use(cors());

//log HTTP requests
app.use(morgan("combined"));

//retrieve all the questions from the database 
app.get('/', (req,res)  => {
    const qs = questions.map( q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        answers: q.answers,
    }));
    res.send(qs);
});

//retrieve a single question from the database 
app.get('/:id',(req,res) => {
    const question = questions.filter( q => (q.id === parseInt(req.params.id) ));
    if (question.length > 1)
        return res.status(500).send();
    if (question.length === 0)
        return res.status(404).send();
    
    res.send(question[0]);
});

//insert a new question

app.post('/', (req, res) => {
    const {title, description} = req.body;
    const newQuestion = {
      id: questions.length + 1,
      title,
      description,
      answers: [],
    };
    questions.push(newQuestion);
    res.status(200).send();
  });


//insert a new answer to the question 
app.post('/answer/:id',(req,res)=> {
    const {answer} = req.body;
    const question = questions.filter( q => (q.id === parseInt(req.params.id) ));
    if (question.length > 1)
        return res.status(500).send();
    if (question.length === 0)
        return res.status(404).send();
    
    question[0].answers.push({
        answer,
    });

    res.status(200).send();

});


//Server start
app.listen(process.env.PORT || 8081, ()=> {
    console.log('listening on Port 8081');
});