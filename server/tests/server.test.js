const expect = require('chai').expect;
const request = require('supertest');

const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todoSeed = [
  {
    _id: ObjectID(),
    text: "First todo"
  },
  {
    _id: ObjectID(),
    text: "Second todo"
  },
  {
    _id: ObjectID(),
    text: "Third todo",
    completed: true,
    completedAt: 12345
  }
];

beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todoSeed).then(() => {
      done();
    });
  }).catch((e) => done(e));
});


describe('POST /todos', () => {
  it("should create a new todo", (done) => {
    var text = 'Test creation of a new todo';
    request(app).post('/todos').send({text})
      .expect(201)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(text);
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

describe('GET /todos/:id', () => {
  it("should return a todo when valid id is provided", (done) => {
    request(app).get(`/todos/${todoSeed[0]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(todoSeed[0].text);
      })
      .end(done);
  });

  it("should return a Not Found response when valid non-existing id is provided", (done) => {
    var validNonExistingId = ObjectID();
    request(app).get(`/todos/${validNonExistingId._id}`)
      .expect(404)
      .end(done);
  });

  it("should return a Bad Request response when invalid id is provided", (done) => {
    var invalidId = "5c020351c412a12e07d26864Abc1d";
    request(app).get(`/todos/${invalidId}`)
      .expect(400)
      .end(done);
  });
});

describe("PATCH /tools/:id", () => {
  it("should update a todo when valid id and content is provided", (done) => {
    var text = 'Update first todo to completed';
    request(app).patch(`/todos/${todoSeed[0]._id}`).send({
      text: text,
      completed: true
    })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(text);
        expect(res.body.todo.completed).to.be.true;
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todoSeed[0]._id)
          .then((todo) => {
            expect(todo.text).to.equal(text);
            expect(todo.completed).to.be.true;
            done();
          })
          .catch((e) => done(e));
      });
  });

  it("should set completedAt if request marks completion for uncompleted todo", (done) => {
    var startTime = new Date().getTime();
    request(app).patch(`/todos/${todoSeed[0]._id}`).send({
      completed: true
    })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(todoSeed[0].text);
        expect(res.body.todo.completed).to.be.true;
        expect(res.body.todo.completedAt).not.to.be.null;
        expect(res.body.todo.completedAt).to.be.a('number');
        expect(res.body.todo.completedAt).to.be.above(startTime);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todoSeed[0]._id)
          .then((todo) => {
            expect(todo.completed).to.be.true;
            expect(todo.completedAt).not.to.be.null;
            expect(todo.completedAt).to.be.a('number');
            expect(todo.completedAt).to.be.above(startTime);
            done();
          })
          .catch((e) => done(e));
      });
  });

  it("should not update completedAt if request marks completion for already completed todo", (done) => {
    request(app).patch(`/todos/${todoSeed[2]._id}`).send({
      completed: true
    })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(todoSeed[2].text);
        expect(res.body.todo.completed).to.be.true;
        expect(res.body.todo.completedAt).not.to.be.null;
        expect(res.body.todo.completedAt).to.be.equal(todoSeed[2].completedAt);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todoSeed[2]._id)
          .then((todo) => {
            expect(todo.completed).to.be.true;
            expect(todo.completedAt).not.to.be.null;
            expect(todo.completedAt).to.be.equal(todoSeed[2].completedAt);
            done();
          })
          .catch((e) => done(e));
      });
  });

  it("should unset completedAt if request removes completion for already completed todo", (done) => {
    request(app).patch(`/todos/${todoSeed[2]._id}`).send({
      completed: false
    })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(todoSeed[2].text);
        expect(res.body.todo.completed).to.be.false;
        expect(res.body.todo.completedAt).to.be.null;
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todoSeed[2]._id)
          .then((todo) => {
            expect(todo.completed).to.be.false;
            expect(todo.completedAt).to.be.null;
            done();
          })
          .catch((e) => done(e));
      });
  });

  it("should return a Not Found message when valid non existing id is provided", (done) => {
    var validNonExistingId = ObjectID();
    var text = 'Update first todo to completed';

    request(app).patch(`/todos/${validNonExistingId._id}`).send({
      text: text,
      completed: true
    })
      .expect(404)
      .end(done);
  });

  it("should return a Bad Request message when invalid id is provided", (done) => {
    var invalidId = "5c020351c412a12e07d26864Abc1d";
    var text = 'Update first todo to completed';

    request(app).patch(`/todos/${invalidId}`).send({
      text: text,
      completed: true
    })
      .expect(400)
      .end(done);
  });

  it("should return a Bad Request message when invalid content is provided", (done) => {
    var invalidId = "5c020351c412a12e07d26864Abc1d";
    var text = 'Update first todo to completed';

    request(app).patch(`/todos/${invalidId}`).send({
      text: text,
      completed: "Another text"
    })
      .expect(400)
      .end(done);
  });

  it("should not update forbidden fields provided in request", (done) => {
    var startTime = new Date().getTime();
    var text = 'Update first todo to completed';
    var bogusTime = new Date().getTime();

    request(app).patch(`/todos/${todoSeed[0]._id}`).send({
      text: text,
      completed: true,
      completedAt: 12345
    })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(text);
        expect(res.body.todo.completed).to.be.true;
        expect(res.body.todo.completedAt).to.be.not.equal(12345);
        expect(res.body.todo.completedAt).to.be.above(startTime);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todoSeed[0]._id)
          .then((todo) => {
            expect(todo.text).to.equal(text);
            expect(todo.completed).to.be.true;
            expect(res.body.todo.completedAt).to.be.not.equal(12345);
            expect(res.body.todo.completedAt).to.be.above(startTime);
            done();
          })
          .catch((e) => done(e));
        });
  });
});

describe("DELETE /todos/:id", () => {
  it("should delete a todo when valid id is provided", (done) => {
    request(app).delete(`/todos/${todoSeed[0]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).to.equal(todoSeed[0]._id.toString());
      })
      .end((err, res) => {
        Todo.findById(todoSeed[0]._id).then((todo) => {
          expect(todo).to.be.null;
          done();
        }).catch((e) => done(e));
      });
  });

  it("should return a Not Found response when a valid non-existing id is provided", (done) => {
    var validNonExistingId = ObjectID();
    request(app).delete(`/todos/${validNonExistingId._id}`)
      .expect(404)
      .end(done);
  });

  it("should return a Bad Request response when an invalid id is provided", (done) => {
    var invalidId = "5c020351c412a12e07d26864Abc1d";
    request(app).delete(`/todos/${invalidId}`)
      .expect(400)
      .end(done);
  });
});
