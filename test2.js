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
var aS_= mongoose.Schema({
    name: String,
    id:Number
}, {collection: 'as'});
aS_.index({id: 1});
var bS_= mongoose.Schema({
    name: String,
    asid:{type:mongoose.Schema.Types.ObjectId,ref:'as'}
}, {collection: 'bs'});

var aS=db.model('as',aS_)
var bS=db.model('bs',bS_)
var test = db.model('test', testSchema)
//-------------


//dao-------------
function* insert_a(data){
	let testTable= aS({
	    "name":data.name,
	    "id":data.id
	});
	return yield testTable.save();
}
function* insert_b(data){
	let testTable= bS({
	    "name":data.name,
	    "asid":data.asid
	});
	return yield testTable.save();
}
 function* insert(data){
	let testTable= test({
	    "name":data.name
	});
	return yield testTable.save();
}

function* select(key,value){
            let sql ={}
            sql[key]=value
           return yield test.find(sql).exec();
        
}


//-------------




app.use(function* (next) {
// yield insert_a({'name':'a','id':1})
// yield insert_a({'name':'aa','id':2})
// yield insert_b({'name':'a','asid':1})
	console.log(yield aS.aggregate([{$group : {_id : "$name", count : {$sum : 1}}}]).exec())

	yield next;
});
router.get('/test',function* (){
	yield insert({'name':'aaaa'})
	let data=yield select('name','aa');
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



