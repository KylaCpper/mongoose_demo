const mongoose = require('mongoose');
var opts = {
    'user': '',
    'pass': '',
    'server':{poolSize:1}
};
var koa = require('koa');
var app = koa();
var koaBody = require('koa-body')();
var router = require('koa-router')();
var db = mongoose.createConnection('127.0.0.1','dabase','27017',{opts});
mongoose.Promise = Promise;

//model-------------
var testSchema = mongoose.Schema({
    name: String
}, {collection: 'test'});
var test = db.model('test', testSchema)
//-------------



//dao-------------

 function* insert(data){
	let testTable= test({
	    "name":data.name
	});
	return yield testTable.save().exec();
}

function* select(key,value){
            let sql ={}
            sql[key]=value
           return yield test.find(sql).exec();
        
}


//-------------




app.use(function* (next) {

	yield next;
});
router.get('/test',function* (){
	console.log('in1')
	let data=yield select('name','aa');

	console.log('in2')
	this.body=data;
});

app.use(router.routes());

app.listen(3000);




db.on('error',(msg)=>{
			console.log("error");
			console.log(msg);
});
db.on('open',(msg)=>{
			console.log("open");
});
db.on('reconnected',(msg)=>{
			console.log("reconnected");
});
db.on('disconnected',(msg)=>{
			console.log("disconnected");
});
db.on('close',(msg)=>{
			console.log("close");
});
db.on('connected',(msg)=>{
			console.log("connected");
});



