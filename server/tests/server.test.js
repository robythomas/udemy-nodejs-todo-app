const expect = require('chai').expect;
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.deleteMany({}).then(() => done());
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
        Todo.find().then((todos) => {
          expect(todos.length).to.equal(1);
          expect(todos[0].text).to.equal(text);
          done();
        }).catch((e) => done(e));
      });
  });
});
