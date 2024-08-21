const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('Products Router', () => {
    it('debería obtener una lista de todos los productos', (done) => {
        chai.request(app)
            .get('/api/products')
            .set('Accept', 'application/json') 
            .end((err, res) => {
                if (err) return done(err);

                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.products).to.be.an('array');
                
                if (res.body.products.length > 0) {
                    expect(res.body.products[0]).to.have.property('nombre');
                    expect(res.body.products[0]).to.have.property('precio');
                    expect(res.body.products[0]).to.have.property('descripcion');
                    expect(res.body.products[0]).to.have.property('stock');
                }
                
                done();
            });
    });
});
