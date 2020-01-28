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
let mergeVisualArr = [];
let quickVisualArr = [];

initialize();

function initialize() {
	clearBoard();
	initArray(parseInt(num_elements_select.value));
	initGraph();
}

function resize() {
	clearBoard();
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
	mergeVisualArr = [];
	quickVisualArr = [];
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

function moveRectangle(rectNum, position) {
	rectTempTop = document.getElementById('rect' + rectNum).offsetTop;
	rectTempHeight = document.getElementById('rect' + rectNum).offsetHeight;

	if (rectNum > position) {
		for (i = rectNum; i > position; i--) {
			rect1 = document.getElementById('rect' + i);
			rect2 = document.getElementById('rect' + (i - 1));

			rect1.style.top = rect2.offsetTop + 'px';
			rect1.style.height = rect2.offsetHeight + 'px';
		}

		rectPos = document.getElementById('rect' + position);
		rectPos.style.top = rectTempTop + 'px';
		rectPos.style.height = rectTempHeight + 'px';
	} else if (rectNum < position) {
		for (i = rectNum; i < position; i++) {
			rect1 = document.getElementById('rect' + i);
			rect2 = document.getElementById('rect' + (i + 1));

			rect1.style.top = rect2.offsetTop + 'px';
			rect1.style.height = rect2.offsetHeight + 'px';
		}

		rectPos = document.getElementById('rect' + position);
		rectPos.style.top = rectTempTop + 'px';
		rectPos.style.height = rectTempHeight + 'px';
	}
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
			break;
		case 'merge':
			arr = mergeSort(arr, 0);
			visualizeMerge(mergeVisualArr, 0, speed);
			break;
		case 'quicksort':
			quickSort(0, arr.length - 1);
			visualizeQuick(quickVisualArr, 0, speed);
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

function mergeSort(mergeSortArr, index) {
	if (mergeSortArr.length == 1) return;

	m = Math.floor(mergeSortArr.length / 2);

	var lArr = mergeSortArr.slice(0, m);
	var rArr = mergeSortArr.slice(m);

	var lIndex = index;
	var rIndex = index + m;

	mergeSort(lArr, lIndex);
	mergeSort(rArr, rIndex);

	return merge(mergeSortArr, lArr, rArr, lIndex, rIndex);
}

function merge(mergeArr, lArr, rArr, lIndex, rIndex) {
	var rcount = 0;
	var lcount = 0;
	llen = lArr.length;
	rlen = rArr.length;
	while (lcount + rcount < llen + rlen) {
		if (lArr[lcount] < rArr[rcount] || rcount >= rlen) {
			mergeArr[lcount + rcount] = lArr[lcount];
			lcount++;
		} else if (rArr[rcount] <= lArr[lcount] || lcount >= llen) {
			// moveRectangle(rIndex + rcount, lIndex + lcount + rcount);
			mergeVisualArr.push([ rIndex + rcount, lIndex + lcount + rcount ]);
			mergeArr[lcount + rcount] = rArr[rcount];
			rcount++;
		}
	}

	return mergeArr;
}

function visualizeMerge(mergeVisualArr, i, ms) {
	if (cancelSort) {
		cancelSort = false;
		return;
	}
	moveRectangle(mergeVisualArr[i][0], mergeVisualArr[i][1]);
	i++;
	if (i < mergeVisualArr.length)
		setTimeout(function() {
			visualizeMerge(mergeVisualArr, i, speed);
		}, ms);
	else disableGo();
}

function quickSort(lIndex, rIndex) {
	if (lIndex >= rIndex) return;

	var pivot = arr[rIndex];
	var i = lIndex;
	var temp = 0;

	for (j = lIndex; j < rIndex; j++) {
		if (arr[j] < pivot) {
			quickVisualArr.push([ i, j ]);
			temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
			i++;
		}
	}
	quickVisualArr.push([ i, rIndex ]);
	temp = arr[i];
	arr[i] = arr[rIndex];
	arr[rIndex] = temp;

	quickSort(lIndex, i - 1);
	quickSort(i + 1, rIndex);
}

function visualizeQuick(quickVisualArr, i, ms) {
	if (cancelSort) {
		cancelSort = false;
		return;
	}
	swapRectangles(quickVisualArr[i][0], quickVisualArr[i][1]);
	i++;
	if (i < quickVisualArr.length)
		setTimeout(function() {
			visualizeQuick(quickVisualArr, i, speed);
		}, ms);
	else disableGo();
}
