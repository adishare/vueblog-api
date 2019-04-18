process.env.NODE_ENV = 'test';
const app = require('../app.js');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const helpers = require('../helpers/helpers.js')
chai.use(chaiHttp);

const UserModel = require('../models/UserModel.js')
const ArticleModel = require('../models/ArticleModel.js')

describe('Article CRUD', () => {

    let User = ''
    let token = ''

    beforeEach((done) => {
        ArticleModel.deleteMany({}, (err) => {
            UserModel.create({
                    name: 'kosasih',
                    email: 'kosasih@mail.com',
                    password: helpers.hash('kosasih'),
                })
                .then(user => {
                    User = user
                    let newtoken = helpers.createToken({
                        _id: user._id.toString(),
                        name : user.name,
                        email : user.email
                    })
                    token = newtoken
                    done()
                })
        })
    });

    afterEach((done) => {
        UserModel.deleteMany({}, (err) => {
            done()
        })
    });

    it('should get all articles', (done) => {
        chai.request(app)
            .get('/articles')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a("array");
                done()
            })
    });

    it('should create new article', (done) => {
        chai.request(app)
            .post('/articles')
            .send({
                title: 'Article Title',
                content: 'Article Contents with min width 20 char',
            })
            .set({
                token : token
            })
            .end((err, res) => {
                expect(res).to.have.status(201)
                expect(res.body).to.have.property("_id");
                expect(res.body).to.have.property("title");
                expect(res.body).to.have.property("content");
                expect(res.body).to.have.property("createdAt");
                expect(res.body).to.have.property("updatedAt");
                expect(res.body).to.have.property("author").eql(String(User._id));
                done()
            })

    });

    it('should not create new article without valid token', (done) => {
        chai.request(app)
            .post('/articles')
            .send({
                title: 'Article Title',
                content: 'Article Contents with min width 20 char',
            })
            .set({
                token : 'invalid toke'
            })
            .end((err, res) => {
                expect(res).to.have.status(500)
                expect(res.body).to.have.property("message").eql('Invalid User Creditial');
                expect(res.body).to.have.property("error");
                done()
            })
    });

    it('should not create new article without token', (done) => {
        chai.request(app)
            .post('/articles')
            .send({
                title: 'Article Title',
                content: 'Article Contents with min width 20 char',
            })
            .end((err, res) => {
                expect(res).to.have.status(500)
                expect(res.body).to.have.property("message").eql('User Creditial Required g1');
                done()
            })
    });


    describe('Update/Delete Article -required token', () => {
        let articleId = ''

        beforeEach((done) => {
            chai.request(app)
            .post('/articles')
            .send({
                title: 'Article Title',
                content: 'Article Contents with min width 20 char',
            })
            .set({
                token : token
            })
            .end((err, res) => {
                articleId = res.body._id
                done()
            });
        });


        it('should update article 200', (done) => {
            chai.request(app)
                .post('/articles')
                .send({
                    title: 'Article Title',
                    content: 'Article Contents with min width 20 char',
                })
                .set({
                    token : token
                })
                .end((err, res) => {
                    let articleId = res.body._id
                    chai.request(app)
                        .put(`/articles/${res.body._id}`)
                        .send({
                            title: 'Article Title Edit',
                            content: 'Article Contents with min width 20 char',
                        })
                        .set({
                            token : token
                        })
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property("message").eql(`Article id ${articleId} Updated`);
                            done()
                        })
                })
        });
    
        it('should delete article', (done) => {
            
            chai.request(app)
                .delete(`/articles/${articleId}`)
                .set({
                    token : token
                })
                .end((err, res) => {
                    expect(res).to.have.status(204);
                    done()
                })
        
        });

        it('should like other user article', (done) => {

            UserModel.create({
                name: 'other',
                email: 'other@mail.com',
                password: helpers.hash('other'),
            })
            .then(user => {
                User = user
                let othernewtoken = helpers.createToken({
                    _id: user._id.toString(),
                    name : user.name,
                    email : user.email
                })
                let othertoken = othernewtoken

                           
                chai.request(app)
                    .post(`/articles/likes/${articleId}`)
                    .send({
                        title: 'Article Title Edit',
                        content: 'Article Contents with min width 20 char',
                    })
                    .set({
                        token : othernewtoken
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property("message");
                        done()
                    })
                
            })

        
        });
    
        it('should not like user own article', (done) => {
           
            chai.request(app)
                .post(`/articles/likes/${articleId}`)
                .send({
                    title: 'Article Title Edit',
                    content: 'Article Contents with min width 20 char',
                })
                .set({
                    token : token
                })
                .end((err, res) => {
                    expect(res).to.have.status(403);
                    expect(res.body).to.have.property("message");
                    done()
                })
        
        });

        it('should increment article viewCount', (done) => {
            chai.request(app)
                .get(`/articles/updateViewer/${articleId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done()
                })
        });
    

    })

    
    


});