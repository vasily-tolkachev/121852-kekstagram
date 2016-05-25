function findSquare (firstArray, secondArray) {
	if (firstArray.lenght === secondArray.lenght) {
		var square = 0;
		for (var i = 0; i < firstArray.length; i++) {
			square += firstArray[i]*secondArray[i];
		}
		return square;
	}
}

function findSumOfArrayElements(array) {
	var sum = 0;
	for (var i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return sum;
}

function getMessage(a,b) {
	if (typeof a === 'boolean') {
		if (a === true) {
			return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
		}
		else {
			return "Переданное GIF-изображение не анимировано";
		}
	}
	else if(typeof a === 'number') {
		return "Переданное SVG-изображение содержит " + a + " объектов и " + b*4 + " аттрибутов";
	}
	else if (Array.isArray(a) && Array.isArray(b)) {
		return "Общая площадь артефактов сжатия: " + findSquare(a, b) + " пикселей";
	}
	else if (Array.isArray(a)) {
		return  "Количество красных точек во всех строчках изображения: " + findSumOfArrayElements(a);
	}
}
