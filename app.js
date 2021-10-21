const express = require('express');
const ExpressError = require('./expressError')

const app = express();

app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.get('/mean', function mean(req, res, next){
	let result;
	try{
		let nums = req.query.nums;
		console.log(nums);
		if (!nums) throw new ExpressError(`nums are required`, 400);
		let numsArr = nums.split(',');

		result = numsArr.reduce((acc, num) => {
			if (Number.isInteger(+num)) return +num + acc;
			else throw new ExpressError(`${num} is not a number`, 400);
		},0) / numsArr.length;

	} catch (e) {
		console.log(e.msg)
		return next(e);
	}

	return res.send({
		response: {
		operation: "mean",
		value: result}
	});
});

app.get('/median', function median(req, res, next){
	let result;
	try{
		let nums = req.query.nums;
		console.log(nums);
		if (!nums) throw new ExpressError(`nums are required`, 400);
		let numsArr = nums.split(',');

		numsArr = numsArr.map(num => {
			if (!Number.isInteger(+num)) {
				throw new ExpressError(`${notNum} is not a number`, 400);
			}
			return +num;
		});
		
		debugger
		numsArr.sort();
		console.log(numsArr)
		if (numsArr.length % 2 === 1) result = numsArr[(numsArr.length - 1) / 2];
		else {
			let midIdx = (numsArr.length - 1) / 2;
			let leftMidIdx = Math.floor(midIdx);
			let rightMidIdx = Math.round(midIdx);
			result = (numsArr[leftMidIdx] + numsArr[rightMidIdx]) / 2;
		}
	} catch (e) {
		console.log(e.msg)
		return next(e);
	}

	return res.send({
		response: {
		operation: "median",
		value: result}
	});
});

app.get('/mode', function mode(req, res, next){
	let result;
	try{
		let nums = req.query.nums;
		console.log(nums);
		if (!nums) throw new ExpressError(`nums are required`, 400);
		let numsArr = nums.split(',');

		numsArr = numsArr.map(num => {
			if (!Number.isInteger(+num)) {
				throw new ExpressError(`${notNum} is not a number`, 400);
			}
			return +num;
		});
		
		let freqCount = numsArr.reduce(function(acc, next) {
			acc[next] = (acc[next] || 0) + 1;
			return acc;
		}, {});
		let count = 0;
  	let mostFrequent;

  	for (let key in freqCount) {
    	if (freqCount[key] > count) {
     	 	mostFrequent = key;
     	 	count = freqCount[key];
    	}
  	}
		result = +mostFrequent;
		console.log(numsArr)

	} catch (e) {
		console.log(e.msg)
		return next(e);
	}

	return res.send({
		response: {
		operation: "mode",
		value: result}
	});
});

app.get('/', (req, res, next) => {
	console.log(req.query);
	res.send('hi');
	// res.json("stuff!!!")
});

app.post('/bro', function bro(req, res){
	res.status(201).send('POst BrO');
});

app.get('/param/:yo', (req, res) => {
	res.send(req.params.yo);
});

function attemptToSaveToDB() {
  throw "Connection Error!"
}

app.get('/savetodb', (req, res, next) => {
  try {
    attemptToSaveToDB()
    return res.send("SAVED TO DB!")
  } catch (e) {
    return next(new ExpressError("Database Error"))
  }
})


// If no other route matches, respond with a 404
app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404)
  next(e);
})

// Error handler
app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.msg;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status }
  });
});

// Set port for server
const port = 3000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});