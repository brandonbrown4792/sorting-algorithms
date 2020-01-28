// Create links to buttons and containers
const graphContainer_div = document.getElementById('graph-container');
const sortSelect_select = document.getElementById('sort-select');
const num_elements_select = document.getElementById('num-elements-select');
const speed_slider = document.getElementById('speed-slider');
const cancelBtn_btn = document.getElementById('cancel-btn');
const goBtn_btn = document.getElementById('go-btn');
const resetBtn_button = document.getElementById('reset-btn');

// Initialize global arrays
let arr = [];
let cancelSort = false;
let speed = 0;
let len = 0;
let mergeVisualArr = [];
let quickVisualArr = [];

// Initialize when page loads
initialize();

// **************   Initialization Methods   ************** //
// Purpose:													//
// 1) Clear graph of any rectangles							//
// 2) Initialize random array for sorting					//
// 3) Create bar chart using random array as heights		//
// ******************************************************** //

function initialize() {
	// Clear graph, initialize array and graph, and enable start
	clearGraph();
	initArray(parseInt(num_elements_select.value));
	initGraph();
	enableGo();
}

function clearGraph() {
	// Clear rectangles from graph container
	graphContainer_div.innerHTML = '';

	// Initialize visualizatoin arrays
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
	// Set position of first rectangle to left-most point on graph
	let x = 0;

	// Set individual rectangle width
	width = graphContainer_div.clientWidth / arr.length;

	// For each item in array, set its position, height, and width
	for (i = 0; i < len; i++) {
		// Compute height with a head padding of 50px and compute y position
		let height = arr[i] * ($(graphContainer_div).outerHeight() - 50) / arr.length;
		let y = $(graphContainer_div).outerHeight() - height + 1;

		// Draw rectangle on screen
		drawRectangle(x, y, width, Math.floor(height));

		// Increment x position by the width of one triangle
		x += width;
	}
}

// **************   UI Interaction Methods   ************** //
// Purpose:													//
// 1) Execute sorting algorithms							//
// 2) Reset graphs and array on request						//
// 3) Enable/disable Go, Reset, and Cancel buttons			//
// 4) Compute algorithm speed on slider change				//
// 5) Update graph on window resize							//
// ******************************************************** //

function sort() {
	// Initialize speed to slider value (inverted)
	speed = speed_slider.max - speed_slider.value;

	// Call requested sorting algorithm
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

	// Enable user to cancel sorting algorithm
	enableCancel();
}

function reset() {
	// Invoke initialize method when reset button is pressed
	initialize();
}

function cancel() {
	// Stop sorting algorithm and display reset button
	cancelSort = true;
	disableGo();
}

function enableGo() {
	// Display go button
	goBtn_btn.style.display = 'inline';
	resetBtn_button.style.display = 'none';
}

function disableGo() {
	// Display reset button
	goBtn_btn.style.display = 'none';
	resetBtn_button.style.display = 'inline';
	disableCancel();
}

function enableCancel() {
	// Display cancel button
	cancelBtn_btn.disabled = false;
}

function disableCancel() {
	// Disable calcel button
	cancelBtn_btn.disabled = true;
}

function setSpeed() {
	// Update speed when slider is moved
	speed = speed_slider.max - speed_slider.value;
}

function resize() {
	// Clear and redraw graph on window resize
	clearGraph();
	initGraph();
}

// **********   Algorithm Array Overhead Method   ********* //
// Purpose:													//
// 1) Swap two values in an array							//
// ******************************************************** //

function swapArrVals(i, j) {
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
}

// **************   Graph Overhead Methods   ************** //
// Purpose:													//
// 1) Draw rectangles on initialize and resize				//
// 2) Swap two rectangles on graph							//
// 3) Insert rectangle into specified position				//
// ******************************************************** //

function drawRectangle(left, top, width, height) {
	// Create new div of class rect
	rectDiv = document.createElement('div');
	rectDiv.classList.add('rect');

	// Set position, height, and width of triangle
	rectDiv.style.left = left + 'px';
	rectDiv.style.top = top + 'px';
	rectDiv.style.height = height + 'px';
	rectDiv.style.width = width + 'px';

	// Assign id to rectangle
	rectDiv.id = 'rect' + i;

	// Insert rectangle into graph container div
	graphContainer_div.appendChild(rectDiv);
}

function swapRectangles(rectNum1, rectNum2) {
	// Initialize rectangles
	rect1 = document.getElementById('rect' + rectNum1);
	rect2 = document.getElementById('rect' + rectNum2);
	let rectTempTop = rect1.offsetTop;
	let rectTempHeight = rect1.offsetHeight;

	// Swap rectangle top positions and heights
	rect1.style.top = rect2.offsetTop + 'px';
	rect1.style.height = rect2.offsetHeight + 'px';
	rect2.style.top = rectTempTop + 'px';
	rect2.style.height = rectTempHeight + 'px';
}

function insertRectangle(rectNum, position) {
	// Initialize temporary rectangle object
	let rectTempTop = document.getElementById('rect' + rectNum).offsetTop;
	let rectTempHeight = document.getElementById('rect' + rectNum).offsetHeight;

	if (rectNum > position) {
		// If moving left, shift rectangles right and insert rectangle to the left
		for (i = rectNum; i > position; i--) {
			rect1 = document.getElementById('rect' + i);
			rect2 = document.getElementById('rect' + (i - 1));

			rect1.style.top = rect2.offsetTop + 'px';
			rect1.style.height = rect2.offsetHeight + 'px';
		}

		// Insert final rectangle to the left
		let rectPos = document.getElementById('rect' + position);
		rectPos.style.top = rectTempTop + 'px';
		rectPos.style.height = rectTempHeight + 'px';
	} else if (rectNum < position) {
		// If moving right, shift rectangles left and insert rectangle to the right
		for (i = rectNum; i < position; i++) {
			// Initialize rectangles
			rect1 = document.getElementById('rect' + i);
			rect2 = document.getElementById('rect' + (i + 1));

			// Move rectangle to the left
			rect1.style.top = rect2.offsetTop + 'px';
			rect1.style.height = rect2.offsetHeight + 'px';
		}

		// Insert final rectangle to the right
		let rectPos = document.getElementById('rect' + position);
		rectPos.style.top = rectTempTop + 'px';
		rectPos.style.height = rectTempHeight + 'px';
	}
}

// ****************   Sorting Algorithms   **************** //
// Purpose:													//
// 1) Provide algorithms for the following:					//
//    a) Selection Sort										//
//    b) Bubble Sort										//
//    c) Insertion Sort										//
//    d) Merge Sort											//
//    e) Quicksort											//
// 2) Provide visualizers for the following:				//
//    a) Merge Sort											//
//    b) Quicksort											//
// ******************************************************** //

function selectionSort(i, len, ms) {
	// Watch for cancel request
	if (cancelSort) {
		cancelSort = false;
		return;
	}

	// Find smallest index of remaining rectangles
	let smallestIndex = i;
	for (j = i + 1; j < len; j++) {
		if (arr[j] < arr[smallestIndex]) {
			smallestIndex = j;
		}
	}

	// Swap smallest index with current rectangle
	iRect = document.getElementById('rect' + i);
	siRect = document.getElementById('rect' + smallestIndex);
	swapRectangles(i, smallestIndex);
	swapArrVals(i, smallestIndex);

	// Increment current rectangle
	i++;

	if (i < len)
		// Add delay to allow DOM to refresh
		setTimeout(function() {
			selectionSort(i, len, speed);
		}, ms);
	else
		// Enable reset after sorting has completed
		disableGo();
}

function bubbleSort(i, len, ms) {
	// Watch for cancel request
	if (cancelSort) {
		cancelSort = false;
		return;
	}

	// Swap rectangles if following rectangle is larger
	for (j = 0; j < len - i - 1; j++) {
		if (arr[j] > arr[j + 1]) {
			swapRectangles(j, j + 1);
			swapArrVals(j, j + 1);
		}
	}

	// Increment current rectangle
	i++;

	if (i < len)
		// Add delay to allow DOM to refresh
		setTimeout(function() {
			bubbleSort(i, len, speed);
		}, ms);
	else
		// Enable reset after sorting has completed
		disableGo();
}

function insertionSort(i, len, ms) {
	// Watch for cancel request
	if (cancelSort) {
		cancelSort = false;
		return;
	}

	// Swap rectangles if preceeding rectangle is larger
	for (j = i; j > 0; j--) {
		if (arr[j] < arr[j - 1]) {
			swapRectangles(j, j - 1);
			swapArrVals(j, j - 1);
		} else break;
	}

	// Increment current rectangle
	i++;

	if (i < len)
		// Add delay to allow DOM to refresh
		setTimeout(function() {
			insertionSort(i, len, speed);
		}, ms);
	else
		// Enable reset after sorting has completed
		disableGo();
}

function mergeSort(mergeSortArr, index) {
	// Return when separated into group of one
	if (mergeSortArr.length == 1) return;

	// Set split point to middle of the array
	m = Math.floor(mergeSortArr.length / 2);

	// Slice array into left and right halves
	let lArr = mergeSortArr.slice(0, m);
	let rArr = mergeSortArr.slice(m);

	// Set left index to start of the left slice and right index to start of the right slice
	let lIndex = index;
	let rIndex = index + m;

	// Recursively call split routine until split into groups of one
	mergeSort(lArr, lIndex);
	mergeSort(rArr, rIndex);

	// Merge groups together
	return merge(mergeSortArr, lArr, rArr, lIndex, rIndex);
}

function merge(mergeArr, lArr, rArr, lIndex, rIndex) {
	// Initialize left and right counter variables for merge
	let rcount = 0;
	let lcount = 0;

	// Calculate left and right array lengths
	llen = lArr.length;
	rlen = rArr.length;

	// Merge until all elements of left and right arrays are used
	while (lcount + rcount < llen + rlen) {
		if (lArr[lcount] < rArr[rcount] || rcount >= rlen) {
			mergeArr[lcount + rcount] = lArr[lcount];
			lcount++;
		} else if (rArr[rcount] <= lArr[lcount] || lcount >= llen) {
			// For rectangle in right split, store to be moved by visualizer method
			mergeVisualArr.push([ rIndex + rcount, lIndex + lcount + rcount ]);
			mergeArr[lcount + rcount] = rArr[rcount];
			rcount++;
		}
	}

	// Return merged array
	return mergeArr;
}

function visualizeMerge(mergeVisualArr, i, ms) {
	// Watch for cancel request
	if (cancelSort) {
		cancelSort = false;
		return;
	}

	// For each rectangle insert request in merge visualizer array, move rectangle to position
	insertRectangle(mergeVisualArr[i][0], mergeVisualArr[i][1]);

	// Increment insert request
	i++;

	if (i < mergeVisualArr.length)
		// Add delay to allow DOM to refresh
		setTimeout(function() {
			visualizeMerge(mergeVisualArr, i, speed);
		}, ms);
	else
		// Enable reset after sorting has completed
		disableGo();
}

function quickSort(lIndex, rIndex) {
	// Return when left index is greater than or equal to right index
	if (lIndex >= rIndex) return;

	// Set pivot to value at end of array
	let pivot = arr[rIndex];

	// Initialize i at beginning of portioned array
	let i = lIndex;

	// Swap values until all values greater than pivot are to the right
	//      and all values less than pivot are to the left
	for (j = lIndex; j < rIndex; j++) {
		if (arr[j] < pivot) {
			quickVisualArr.push([ i, j ]);
			swapArrVals(i, j);
			i++;
		}
	}

	// Swap pivot with first greater value from left
	quickVisualArr.push([ i, rIndex ]);
	swapArrVals(i, rIndex);

	// Repeat on left and right portions of array until sorted
	quickSort(lIndex, i - 1);
	quickSort(i + 1, rIndex);
}

function visualizeQuick(quickVisualArr, i, ms) {
	// Watch for cancel request
	if (cancelSort) {
		cancelSort = false;
		return;
	}

	// For each rectangle swap request in quicksort visualizer array, swap rectangles
	swapRectangles(quickVisualArr[i][0], quickVisualArr[i][1]);

	// Increment swap request
	i++;

	if (i < quickVisualArr.length)
		// Add delay to allow DOM to refresh
		setTimeout(function() {
			visualizeQuick(quickVisualArr, i, speed);
		}, ms);
	else
		// Enable reset after sorting has completed
		disableGo();
}
