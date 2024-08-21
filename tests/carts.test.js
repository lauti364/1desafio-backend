const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('Carts Router', () => {
    it('debería obtener una lista de todos los carritos', (done) => {
        chai.request(app)
            .get('/api/carts')
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (err) return done(err);

                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                
                if (res.body.length > 0) {
                    expect(res.body[0]).to.have.property('products');
                }
                
                done();
            });
    });
});
