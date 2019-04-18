process.env.NODE_ENV = 'test';
const app = require('../app.js');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const helpers = require('../helpers/helpers.js')
chai.use(chaiHttp);

const UserModel = require('../models/UserModel.js')
const ArticleModel = require('../models/ArticleModel.js')
const CommentModel = require('../models/CommentModel.js')

describe('Comment CRD', () => {

    let User = ''
    let token = ''
    let articleId = ''
    let commentId = ''

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
                })
        })
    });

    afterEach((done) => {
        UserModel.deleteMany({}, (err) => {
            done()
        })
    });

    //--

    it('should get all articles comments', (done) => {
        chai.request(app)
            .get(`/comments/${articleId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a("array");
                done()
            })
    });

    it('should create new comment', (done) => {
        chai.request(app)
            .post(`/comments/${articleId}`)
            .send({
                comment: 'user comment',
            })
            .set({
                token : token
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("comments");
                done()
            })

    });

    it('should not create new comment without valid token', (done) => {
        chai.request(app)
            .post(`/comments/${articleId}`)
            .send({
                comment : 'user comment' 
            })
            .set({
                token : 'invalid token'
            })
            .end((err, res) => {
                expect(res).to.have.status(500)
                expect(res.body).to.have.property("message").eql('Invalid User Creditial');
                expect(res.body).to.have.property("error");
                done()
            })
    });


    it('should delete comment', (done) => {

        CommentModel.create({
            user : User._id,
            article : articleId.toString(),
            comment : 'string'
        })
        .then((result) => {

            chai.request(app)
                .delete(`/comments/${result._id}`)
                .set({
                    token : token
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("message").eql(`commentId ${result._id} deleted`);
                    done()
                })
            
        })


    
    });

   
 

    


    
    


});