const expect = require('chai').expect;
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todoSeed = [
  {text: "First todo"},
  {text: "Second todo"},
  {text: "Third todo"}
];

beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todoSeed).then(() => {
      done();
    });
  }).catch((e) => done(e));
});

describe('GET /todos', () => {
  it("should list all todos", (done) => {
    request(app).get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).to.equal(3);
      })
      .end(done);
  });
});

describe('POST /todos', () => {
  it("should create a new todo", (done) => {
    var text = 'Test creation of a new todo';
    request(app).post('/todos').send({text})
      .expect(201)
      .expect((res) => {
        expect(res.body.text).to.equal(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().where('text').nin(todoSeed.map(a => a.text))
          .then((todos) => {
            expect(todos.length).to.equal(1);
            expect(todos[0].text).to.equal(text);
            done();
          })
          .catch((e) => done(e));
      });
  });

  it("should not create a new todo with invalid body data", (done) => {
    request(app).post('/todos').send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().where('text').nin(todoSeed.map(a => a.text))
          .then((todos) => {
            expect(todos).to.be.empty;
            done();
          })
          .catch((e) => done(e));
      });
  });
});
