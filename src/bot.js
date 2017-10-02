const LineConnect = require('./connect');
let LINE = require('./main.js');

const auth = {
 	authToken: 'EloYJSklOXWliORpKycc.F1/lFPvHtupEL7bw5g5uNa.FS9WFNXjdFwOEqGrsJzDtTl75B5w6iJU5SKKF+XKTQE=',
 	certificate: '5b55e5c83535d8a0d8a4896c89c9bcc49e443acd5cc1e89d85406764117370b5'
}
 let client =  new LineConnect(auth);
//let client =  new LineConnect();

client.startx().then(async (res) => {
	
	while(true) {
		try {
			ops = await client.fetchOps(res.operation.revision);
		} catch(error) {
			console.log('error',error)
		}
		for (let op in ops) {
			if(ops[op].revision.toString() != -1){
				res.operation.revision = ops[op].revision;
				LINE.poll(ops[op])
			}
		}
	}
});
