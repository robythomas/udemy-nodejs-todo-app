const expect = require('chai').expect;
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.deleteMany({}).then(() => done());
});

describe('GET /todos', () => {
  it("should list all todos", (done) => {
    var todo = new Todo({
      text: 'First todo'
    });
    todo.save();
    todo = new Todo({
      text: 'Second todo'
    });
    todo.save();
    todo = new Todo({
      text: 'Third todo'
    });
    todo.save();

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
        Todo.find()
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
          return done(error);
        }
        Todo.find()
          .then((todos) => {
            expect(todos).to.be.empty;
            done();
          })
          .catch((e) => done(e));
      });
  });
});