const LineConnect = require('./connect');
let LINE = require('./main.js');

const auth = {
	authToken: ' Ems2OiigtKkV98SL6MXe.NxOm/S29HsqznYOQ+r2QRG.7k3oEYx8erznHrcIzq1YwJtz6okqyRGDoAmtISxRkHQ=',
	certificate: '2d80561bc2f17ad540aa804e5b82e663fa0af12ca6b60b1a0898456ecc26962c',
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
