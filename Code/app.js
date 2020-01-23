const graphContainer_div = document.getElementById('graph-container');
const num_elements_select = document.getElementById('num-elements-select');
const speed_slider = document.getElementById('speed-slider');
const cancelBtn_btn = document.getElementById('cancel-btn');
const goBtn_btn = document.getElementById('go-btn');
const resetBtn_button = document.getElementById('reset-btn');
let arr = [];
let cancelSort = false;

initialize();

function initialize() {
	clearBoard();
	initArray(parseInt(num_elements_select.value));
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

	// Fill array with element values set from 0 to numElements
	for (i = 0; i < startArray.length; i++) {
		startArray[i] = i + 1;
	}

	// Randomize elements of startArray into new array called randArr
	for (i = 0; i < randArr.length; i++) {
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

	for (i = 0; i < arr.length; i++) {
		var height = arr[i] * ($(graphContainer_div).outerHeight() - 50) / arr.length;
		var y = $(graphContainer_div).outerHeight() - height + 1;
		drawRectangle(x, y, width, Math.floor(height));
		x += width;
	}

	enableGo();
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

function sort() {
	selectionSort(0, arr.length, speed_slider.max - speed_slider.value);
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
	console.log('Swapping ' + i + ' & ' + smallestIndex);
	iRect = document.getElementById('rect' + i);
	siRect = document.getElementById('rect' + smallestIndex);
	swapRectangles(i, smallestIndex);
	var temp = arr[i];
	arr[i] = arr[smallestIndex];
	arr[smallestIndex] = temp;
	i++;
	if (i < len)
		setTimeout(function() {
			selectionSort(i, len, speed_slider.max - speed_slider.value);
		}, ms);
	else disableGo();
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

/**************************Google Chart**************************

// Load the Visualization API and the corechart package.
google.charts.load('current', { packages: [ 'corechart' ] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
	// Create the data table.
	var data = new google.visualization.DataTable();
	data.addColumn('string', '');
	data.addColumn('number', '');
	for (i = 0; i < arr.length; i++) {
		data.addRows([ [ '', arr[i] ] ]);
	}

	// Set chart options
	var options = {
		title  : '',
		width  : 1000,
		height : 400
	};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}

**************************Canvas**************************
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

drawChart();

function drawChart() {
	var width = canvas.width / 100;
	var x = 0;

	for (i = 0; i < arr.length; i++) {
		var height = arr[i] * (canvas.height / 110);
		// draw border
		ctx.fillStyle = '#000000';
		ctx.fillRect(x, canvas.height - height, width, height);
		// draw middle
		ctx.fillStyle = '#008080';
		ctx.fillRect(x + 1, canvas.height - height + 1, width - 2, height - 2);
		x = x + width;
	}
}
*/
