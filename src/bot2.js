const LineConnect = require('./connect');
let LINE = require('./main.js');

const auth = {
 	authToken: 'ElRWPRiDtfZwsL4t58qd.ECY3SwYO52mGYgzY8n7I7q.vnK37iutS8TUjGNo91EWyI969VxviH3+5Bt9JmOYpjs=',
 	certificate: '75aa3029c22aaea9656ec43caa37ae8e32ac451507ff1f26e960c03ffddc8b9a'
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
