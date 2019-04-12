ymaps.ready(function () {
	var myMap = new ymaps.Map('map', {
		center: [55.755814, 37.617635	],
		zoom: 12
	}, {
			searchControlProvider: 'yandex#search'
	}),

	d8= new ymaps.Placemark([55.762206, 37.656658], {
			hintContent: 'Земляной вал, д.8',
			balloonContent: 'Земляной вал, д.8'
	}, {
			// Опции.
			// Необходимо указать данный тип макета.
			iconLayout: 'default#image',
			// Своё изображение иконки метки.
			iconImageHref: 'img/pin.png',
			// Размеры метки.
			iconImageSize: [48, 63],
			// Смещение левого верхнего угла иконки относительно
			// её "ножки" (точки привязки).
			iconImageOffset: [-24, -63],
	}),

	d36 = new ymaps.Placemark([55.788353, 37.567922], {
			hintContent: 'Ленинградский проспект, 36, стр.11',
			balloonContent: 'Ленинградский проспект, 36, стр.11'
	}, {
			// Опции.
			// Необходимо указать данный тип макета.
			iconLayout: 'default#imageWithContent',
			// Своё изображение иконки метки.
			iconImageHref: 'img/pin.png',
			// Размеры метки.
			iconImageSize: [48, 63],
			// Смещение левого верхнего угла иконки относительно
			// её "ножки" (точки привязки).
			iconImageOffset: [-24, -63],
			// Смещение слоя с содержимым относительно слоя с картинкой.
			iconContentOffset: [15, 15],
			// Макет содержимого.
	}),
	d12 = new ymaps.Placemark([55.749511, 37.537083], {
			hintContent: 'Пресненская наб., 12',
			balloonContent: 'Пресненская наб., 12'
	}, {
			// Опции.
			// Необходимо указать данный тип макета.
			iconLayout: 'default#imageWithContent',
			// Своё изображение иконки метки.
			iconImageHref: 'img/pin.png',
			// Размеры метки.
			iconImageSize: [48, 63],
			// Смещение левого верхнего угла иконки относительно
			// её "ножки" (точки привязки).
			iconImageOffset: [-24, -63],
			// Смещение слоя с содержимым относительно слоя с картинкой.
			iconContentOffset: [15, 15],
			// Макет содержимого.
	}),
	d5 = new ymaps.Placemark([55.768588, 37.592267], {
			hintContent: 'ул. Большая Садовая, д. 5, корп. 1',
			balloonContent: 'ул. Большая Садовая, д. 5, корп. 1'
	}, {
			// Опции.
			// Необходимо указать данный тип макета.
			iconLayout: 'default#imageWithContent',
			// Своё изображение иконки метки.
			iconImageHref: 'img/pin.png',
			// Размеры метки.
			iconImageSize: [48, 63],
			// Смещение левого верхнего угла иконки относительно
			// её "ножки" (точки привязки).
			iconImageOffset: [-24, -63],
			// Смещение слоя с содержимым относительно слоя с картинкой.
			iconContentOffset: [15, 15],
			// Макет содержимого.
	});

	myMap.geoObjects
		.add(d8)
		.add(d36)
		.add(d12)
		.add(d5);
});
