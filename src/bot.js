const LineConnect = require('./connect');
let LINE = require('./main.js');

const auth = {
	authToken: ' EmrC9zAq6B7ZRg2uZcK0.GTNGDYuME/ZSRopxKL7Jqa.c+C0zMu/R/5LF89ilenGz9EyQgbKKxWV3dk5UpKaTpQ=',
	certificate: '1efa196ca6c072562844d3c22b28612e8df2ad603fb6a461404461e2d3e0d5fd',
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
