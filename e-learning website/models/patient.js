var DB = require('../db').DB;

var Patient = DB.Model.extend({
   tableName: 'patients',
   idAttribute: 'id',
});

module.exports = {
   Patient: Patient
};