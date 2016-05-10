import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-authentication'));


export default class Authentication {
    constructor() {
        this.remoteDB = new PouchDB('https://code-pad.cloudant.com/user_accounts', { skipSetup: true });
        this.localDB = new PouchDB('user_accounts');
        this.localDB.sync(this.remoteDB, { live: true, retry: true, auth: {username: 'code-pad', password: 'supersecret'} }).on('error', console.log.bind(console));
        this.registerUser();
    }

    registerUser() {
        this.remoteDB.signup('batman', 'brucewayne', function (err, response) {
            if (err) {
                if (err.name === 'conflict') {
                    // "batman" already exists, choose another username 
                } else if (err.name === 'forbidden') {
                    // invalid username 
                } else {
                    // HTTP error, cosmic rays, etc. 

                }
            }
            console.log(err);
            console.log(response);
        });

    }
}

