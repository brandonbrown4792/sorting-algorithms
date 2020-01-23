const graphContainer_div = document.getElementById('graph-container');
const sortSelect_select = document.getElementById('sort-select');
const num_elements_select = document.getElementById('num-elements-select');
const speed_slider = document.getElementById('speed-slider');
const cancelBtn_btn = document.getElementById('cancel-btn');
const goBtn_btn = document.getElementById('go-btn');
const resetBtn_button = document.getElementById('reset-btn');

let arr = [];
let cancelSort = false;
let speed = 0;
let len = 0;

initialize();

function initialize() {
	clearBoard();
	//initArray(parseInt(num_elements_select.value));
	initArray(16);
	initGraph();
}

function resize() {
	clearBoard();
	initGraph();
}

function reset() {
	initialize();
	resetBtn_button.style.display = 'none';
}

function clearBoard() {
	graphContainer_div.innerHTML = '';
}

function initArray(numElements) {
	// Create arrays with numElements elements
	let startArray = Array(numElements);
	let randArr = Array(numElements);
	len = startArray.length;

	// Fill array with element values set from 0 to numElements
	for (i = 0; i < len; i++) {
		startArray[i] = i + 1;
	}

	// Randomize elements of startArray into new array called randArr
	for (i = 0; i < len; i++) {
		randomInt = Math.floor(Math.random() * startArray.length);
		randArr[i] = startArray[randomInt];
		startArray.splice(randomInt, 1);
	}

	// Copy random array to global array called arr
	arr = randArr;
}

function initGraph() {
	var x = 0;
	width = graphContainer_div.clientWidth / arr.length;

	for (i = 0; i < len; i++) {
		var height = arr[i] * ($(graphContainer_div).outerHeight() - 50) / arr.length;
		var y = $(graphContainer_div).outerHeight() - height + 1;
		drawRectangle(x, y, width, Math.floor(height));
		x += width;
	}

	enableGo();
}

function setSpeed() {
	speed = speed_slider.max - speed_slider.value;
}

function enableCancel() {
	cancelBtn_btn.disabled = false;
}

function disableCancel() {
	cancelBtn_btn.disabled = true;
}

function cancel() {
	cancelSort = true;
	disableGo();
}

function enableGo() {
	goBtn_btn.style.display = 'inline';
	resetBtn_button.style.display = 'none';
}

function disableGo() {
	goBtn_btn.style.display = 'none';
	resetBtn_button.style.display = 'inline';
	disableCancel();
}

function drawRectangle(left, top, width, height) {
	rectDiv = document.createElement('div');
	rectDiv.classList.add('rect');
	rectDiv.style.left = left + 'px';
	rectDiv.style.top = top + 'px';
	rectDiv.style.height = height + 'px';
	rectDiv.style.width = width + 'px';
	rectDiv.id = 'rect' + i;
	graphContainer_div.appendChild(rectDiv);
}

function swapRectangles(rectNum1, rectNum2) {
	currentDate = Date.now();
	rect1 = document.getElementById('rect' + rectNum1);
	rect2 = document.getElementById('rect' + rectNum2);
	var rectTempTop = rect1.offsetTop;
	var rectTempHeight = rect1.offsetHeight;

	rect1.style.top = rect2.offsetTop + 'px';
	rect1.style.height = rect2.offsetHeight + 'px';
	rect2.style.top = rectTempTop + 'px';
	rect2.style.height = rectTempHeight + 'px';
}

function moveRectangleTemp() {
	moveRectangle(24, 0);
}

function moveRectangle(rectNum, position) {
	rectTempTop = document.getElementById('rect' + rectNum).offsetTop;
	rectTempHeight = document.getElementById('rect' + rectNum).offsetHeight;
	for (i = rectNum; i > position; i--) {
		rect1 = document.getElementById('rect' + i);
		rect2 = document.getElementById('rect' + (i - 1));

		rect1.style.top = rect2.offsetTop + 'px';
		rect1.style.height = rect2.offsetHeight + 'px';
	}

	rectPos = document.getElementById('rect' + position);
	rectPos.style.top = rectTempTop + 'px';
	rectPos.style.height = rectTempHeight + 'px';
}

function sort() {
	speed = speed_slider.max - speed_slider.value;
	switch (sortSelect_select.value) {
		case 'selection':
			selectionSort(0, len, speed);
			break;
		case 'bubble':
			bubbleSort(0, len, speed);
			break;
		case 'insertion':
			insertionSort(0, len, speed);
	}
	enableCancel();
}

function selectionSort(i, len, ms) {
	if (cancelSort) {
		cancelSort = false;
		return;
	}
	var smallestIndex = i;
	for (j = i + 1; j < len; j++) {
		if (arr[j] < arr[smallestIndex]) {
			smallestIndex = j;
		}
	}
	iRect = document.getElementById('rect' + i);
	siRect = document.getElementById('rect' + smallestIndex);
	swapRectangles(i, smallestIndex);
	var temp = arr[i];
	arr[i] = arr[smallestIndex];
	arr[smallestIndex] = temp;
	i++;
	if (i < len)
		setTimeout(function() {
			selectionSort(i, len, speed);
		}, ms);
	else disableGo();
}

function bubbleSort(i, len, ms) {
	if (cancelSort) {
		cancelSort = false;
		return;
	}
	for (j = 0; j < len - i - 1; j++) {
		if (arr[j] > arr[j + 1]) {
			swapRectangles(j, j + 1);
			var temp = arr[j];
			arr[j] = arr[j + 1];
			arr[j + 1] = temp;
		}
	}
	i++;
	if (i < len)
		setTimeout(function() {
			bubbleSort(i, len, speed);
		}, ms);
	else disableGo();
}

function insertionSort(i, len, ms) {
	if (cancelSort) {
		cancelSort = false;
		return;
	}
	for (j = i; j > 0; j--) {
		if (arr[j] < arr[j - 1]) {
			swapRectangles(j, j - 1);
			var temp = arr[j];
			arr[j] = arr[j - 1];
			arr[j - 1] = temp;
		} else break;
	}
	i++;
	if (i < len)
		setTimeout(function() {
			insertionSort(i, len, speed);
		}, ms);
	else disableGo();
}

function test() {
	console.log("Beginning Array: " + arr);
	mergeSort(arr, 0, arr.length)
}

var mergeIndex = 0;

function mergeSort(arr, l, r) {
	if (arr.length == 1) return 1;
	else {
		m = Math.floor((r - l) / 2);
	
		var lArr = [m];
		var rArr = [r - l - m];
	
		for (i = 0; i < m; i++) {
			lArr[i] = arr[i];
		}
		for (i = 0; i < (r - l - m); i++) {
			rArr[i] = arr[m + i];
		}
	
		mergeSort(lArr, 0, lArr.length);
		mergeSort(rArr, 0, rArr.length);

		merge(arr, lArr, rArr);
	}
}

var leftSide = true;

function merge(arr, lArr, rArr) {
	var rcount = 0;
	var lcount = 0;
	var outcount = 0;
	llen = lArr.length;
	rlen = rArr.length;
	console.log("Comparing " + lArr + " & " + rArr);
	while (outcount < (llen + rlen)) {
		if (lArr[lcount] < rArr[rcount] || rcount >= rlen) {
			console.log("Left side, value: " + lArr[lcount]);
			console.log("Moving rect" + (mergeIndex + lcount) + " to rect" + (mergeIndex + outcount));
			moveRectangle((mergeIndex + lcount), (mergeIndex + outcount));
			arr[outcount] = lArr[lcount];
			lcount++;
		}
		else if (rArr[rcount] <= lArr[lcount] || lcount >= llen) {
			console.log("Right side, value: " + rArr[rcount]);
			console.log("Moving rect" + (mergeIndex + rcount + llen) + " to rect" + (mergeIndex + outcount));
			moveRectangle((mergeIndex + rcount + llen), (mergeIndex + outcount));
			arr[outcount] = rArr[rcount];
			rcount++;
		}
		outcount++;
	}
	if (leftSide) {
		mergeIndex += outcount;
	}
	else {
		mergeIndex -= outcount;
	}
	leftSide = !leftSide;
	console.log("Output array: " + arr);
	console.log("Merge Index: " + mergeIndex);
}