process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Bear = require('../app/models/bear');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Bears', () => {
  beforeEach((done) => {
    Bear.remove({}, (err) => {
      done();
    });
  });

  describe('/GET bears', () => {
    it('it should GET all the bears', (done) => {
      chai.request(server)
      .get('/api/bears')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done()
      });
    });
  });

  describe('/POST bear', () => {
    it('it should not POST a bear without a name field', (done) => {
      let bear = {
        age: 3
      };
      chai.request(server)
      .post('/api/bears')
      .send(bear)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('name');
        res.body.errors.name.should.have.property('kind').eql('required');
        done();
      });
    });
    it('it should POST a bear', (done) => {
      let bear = {
        name: 'Pooh'
      };
      chai.request(server)
        .post('/api/bears')
        .send(bear)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Bear created');
          res.body.bear.should.have.property('name');
          done();
        });
    });
  });

describe('/GET/:id bear', () => {
  it('it should GET a bear by its id', (done) => {
    let bear = new Bear({name: 'Theodore'});
    bear.save((err, bear) => {
      chai.request(server)
        .get('/api/bears/' + bear.id)
        .send(bear)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('_id').eql(bear.id);
          done();
        });
    });
  });
});

describe('/PUT/:id bear', () => {
  it('it should UPDATE a bear by its id', (done) => {
    let bear = new Bear({name: 'Paddington'});
    bear.save((err, bear) => {
      chai.request(server)
      .put('/api/bears/' + bear.id)
      .send({name: 'Rupert'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Bear updated');
        res.body.bear.should.have.property('name').eql('Rupert');
        done();
      });
    });
  });
});

describe('DELETE/:id bear', () => {
  it('it should DELETE a bear with a given id', (done) => {
    let bear = new Bear({name: 'Yogi'});
    bear.save((err, bear) => {
      chai.request(server)
      .delete('/api/bears/' + bear.id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Bear deleted');
        done();
      })
    })
  })
})
})
