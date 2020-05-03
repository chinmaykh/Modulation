var mongoose = require('mongoose');

// Story Schema
var UnitSchema = mongoose.Schema({
	head:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    parents:{
        type:Array
    },
    creationDate: {
		type: Date,
		required: true
	},
	lastUpdated: {
		type: Date,
		required: true
    },
    subUnit:[]
});

const unit = module.exports = mongoose.model('unit', UnitSchema);//accessible from anywhere else

module.exports.getUnit = (callback, limit) =>{
	unit.find(callback).limit(limit);
};

module.exports.getUnitById = (id, callback) =>{
	unit.find({_id: id}, callback);
};

module.exports.getUnitByParam = (param, callback) =>{
	unit.find(param, callback);
};

module.exports.addUnit = (store, callback) =>{
	unit.create(store,callback);
};

module.exports.removeUnit = (id,callback)=>{
    unit.remove({_id:id},callback);
}

module.exports.updateUnit = (upd,callback)=>{
    unit.updateOne({_id:upd._id}, upd,callback);
}