const assert = require('assert')
const server = require('./server')
const chai = require('chai')
const chaiHttp = require('chai-http')
const mocha = require('mocha')
const should = chai.should();
chai.use(chaiHttp)

after(()=> {
    server.close();
});

describe('Server', function() {
    it('should return status of 200 when loaded', (done) => {
        chai
        .request(server)
        .get("/")
        .end((err, res) => {
            res.should.have.status(200);
            done();
          });
    })

})
