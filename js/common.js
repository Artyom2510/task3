$(function() {
	function createStore(reducer, initialState) {
		var state = initialState;
		var callbacks = [];
	  
		var getState = function () {
		  return $.extend({}, state);
		}
	  
		var dispatch = function (action) {
		  state = reducer(state, action);
		  callbacks.forEach(function (callback) {
			callback();
		  });
		}
	  
		var subscribe = function (callback) {
		  callbacks.push(callback);
		  return function () {
			callbacks.filter(function (cb) {
			  return cb !== callback;
			});
		  };
		}
	  
		dispatch({});
	  
		return {
		  getState,
		  dispatch,
		  subscribe
		};
	}

	function getDate(format, value) {
		var date;
		try {
				date = $.datepicker.parseDate(format, value);
		} catch(error) {
				date = null;
		}
		return date;
	}

	var locationData = {
		'dinamo': [
			{
				amountPeople: {
					from: 5,
					to: 8
				},
				meetingRoom: [
					{
						id: 0,
						name: 'Динамо #5',
						adress: 'Ленинградский проспект, вл.36, к.5',
						desc: '6 посадочных мест, общий стол, флипчарт с маркерами.',
						previewImgUrl: 'img/location.png',
						prices: {
							office: 18000,
							place: 24000,
							meetingRoomFirstTime: 2000,
							meetingRoomNextTime: 1000,
							meetingRoomFullDay: 7000
						}
					},
					{
						id: 1,
						name: 'Динамо #6',
						adress: 'Ленинградский проспект, вл.36, к.6',
						desc: '6 посадочных мест, общий стол, флипчарт с маркерами.',
						previewImgUrl: 'img/location.png',
						prices: {
							office: 18000,
							place: 24000,
							meetingRoomFirstTime: 2000,
							meetingRoomNextTime: 1000,
							meetingRoomFullDay: 7000
						}
					}
				]
			},
			{
				amountPeople: {
					from: 9,
					to: 12
				},
				meetingRoom: [
					{
						id: 2,
						name: 'Динамо #9',
						adress: 'Ленинградский проспект, вл.36, к.5',
						desc: '6 посадочных мест, общий стол, флипчарт с маркерами.',
						previewImgUrl: 'img/location.png',
						prices: {
							office: 18000,
							place: 24000,
							meetingRoomFirstTime: 2000,
							meetingRoomNextTime: 1000,
							meetingRoomFullDay: 7000
						}
					},
					{
						id: 3,
						name: 'Динамо #10',
						adress: 'Ленинградский проспект, вл.36, к.6',
						desc: '6 посадочных мест, общий стол, флипчарт с маркерами.',
						previewImgUrl: 'img/location.png',
						prices: {
							office: 18000,
							place: 24000,
							meetingRoomFirstTime: 2000,
							meetingRoomNextTime: 1000,
							meetingRoomFullDay: 7000
						}
					}
				]
			}
		]
	};

	var bookedMeetingRoom = [
		{
			date: '1555016400000',
			locationId: 'dinamo',
			meetingRoomId: 0,
			time: [
				{
					from: 3,
					to: 5
				},
				{
					from: 8,
					to: 9
				},
				{
					from: 12,
					to: 16
				}
			]
		},
		{
			date: '1555016400000',
			locationId: 'dinamo',
			meetingRoomId: 2,
			time: [
				{
					from: 3,
					to: 5
				},
				{
					from: 7,
					to: 8
				},
				{
					from: 12,
					to: 16
				}
			]
		}
	]
	
	// Компонента страницы
	var BookingMeetingRoom = window.Timeline || {};

	BookingMeetingRoom = (function() {
		function BookingMeetingRoom(settings) {
			var _ = this;

			_.locationData = settings.locationData;

			_.$meetingRoomCards = $('.meeting-rooms__cards');
			_.$meetingRoomHint = $('.meeting-rooms__hint');
			_.$meetingRoomRightCard = $('.meeting-rooms__right-card');
			_.$meetingRoomRightCards = $('.right-card__blocks');

			_.$selectMeetingRoom = $('.select-negotiation__select_meeting-room');
			_.$selectDate = $('.select-negotiation__select_date');
			_.$selectAmountPeople = $('.select-negotiation__select_amount-people');

			_.$filterPropInput = $('.bmr-filter-prop');

			_.store = createStore(_.reducer, {
				filter: {
					'meeting_room': '',
					'date': '',
					'amount_people': ''
				},
				bookedMeetingRoom: [],
				reservedMeetingRoom: []
			});

			_.unsubscribe = _.store.subscribe(function () {
				_.update();
			});

			_.init();
		}
		return BookingMeetingRoom;
	}());

	BookingMeetingRoom.prototype.init = function() {
		var _ = this;

		var filterProps = _.getInitFilterProps();
		for( var prop in filterProps ) {
			_.updateFilter(prop, filterProps[prop]);
			_.updateBookedMeetingRoom();
			_.renderMeetingRoomCards();
		}

		_.$filterPropInput.on('change', function(e) {
			e.preventDefault();

			_.updateFilter(e.target.name, e.target.value);
			_.updateBookedMeetingRoom();
			_.renderMeetingRoomCards();
		});

		_.$meetingRoomRightCard.css('display', 'none');
	}

	BookingMeetingRoom.prototype.update = function() {
		var _ = this;
		var state = _.store.getState();

		console.log(state);
	}

	BookingMeetingRoom.prototype.updateFilter = function(prop, value) {
		var _ = this;

		_.store.dispatch({
			type: 'UPDATE_FILTER_PROP',
			payload: {
				prop: prop,
				value: value
			}
		});
	}

	// Обновление состояния забронированных переговорок
	BookingMeetingRoom.prototype.updateBookedMeetingRoom = function() {
		var _ = this;

		var newData = _.getBookedMeetingRoom();
		_.store.dispatch({
			type: 'UPDATE_BOOKED_MEETING_ROOM',
			payload: newData
		});
	}

	// Обновление состояния зарезервированных переговорок
	BookingMeetingRoom.prototype.updateReservedMeetingRoom = function(data) {
		var _ = this;

		_.store.dispatch({
			type: 'UPDATE_RESERVED_MEETING_ROOM',
			payload: data
		});
	}

	BookingMeetingRoom.prototype.getInitFilterProps = function() {
		var _ = this;

		var result = {};

		_.$filterPropInput.each(function(id, input) {
			result[input.name] = input.value;
		});

		return result;
	}

	BookingMeetingRoom.prototype.getBookedMeetingRoom = function() {
		var _ = this;

		return bookedMeetingRoom;
	}

	// Рендер всех карточек переговорок
	BookingMeetingRoom.prototype.renderMeetingRoomCards = function() {
		var _ = this;
		var state = _.store.getState();

		_.$meetingRoomCards.empty();

		if( typeof _.locationData[state.filter['meeting_room']] === 'undefined' ) return false;
		_.locationData[state.filter['meeting_room']].forEach(function(location) {
			if( +location.amountPeople.to === +state.filter['amount_people'] ) {
				location.meetingRoom.forEach(function(item) {
					var $card = _.renderMeetingRoomCard(item);
					_.$meetingRoomCards.append($card);
				});
			}
		});
	}

	// Рендер карточки переговорки
	BookingMeetingRoom.prototype.renderMeetingRoomCard = function(d) {
		var _ = this;
		var state = _.store.getState();

		var $card = $('<div class="meeting-rooms__card meeting-rooms-card" />');
		var $cardTop = $('<div class="meeting-rooms-card__top" />');
		var $cardImgBlock = $('<a class="meeting-rooms-card__img-block" href="#" />');
		var $cardImgBlockImg = $('<img src="'+ d.previewImgUrl +'" alt="'+ d.name +'" >');
		var $cardImgBlockLabel = $('<div class="meeting-rooms-card__img-label">'+ d.adress +'</div>');
		var $cardInfo = $('<div class="meeting-rooms-card__info" />');
		var $cardName = $('<span class="meeting-rooms-card__name">'+ d.name +'</span>');
		var $cardDesc = $('<p class="meeting-rooms-card__desc">'+ d.desc +'</p>');
		var $cardPriceList1 = $('<div class="meeting-rooms-card__price-list" />');
		var $cardPriceList1Variant = $('<span class="meeting-rooms-card__variant">Офис</span>');
		var $cardPriceList1Price = $('<span class="meeting-rooms-card__price">'+ d.prices.office +' руб.</span>');
		var $cardPriceList2 = $('<div class="meeting-rooms-card__price-list" />');
		var $cardPriceList2Variant = $('<span class="meeting-rooms-card__variant">Закрепленное рабочее место</span>');
		var $cardPriceList2Price = $('<span class="meeting-rooms-card__price">'+ d.prices.place +' руб.</span>');
		var $cardTimeline = $('<div class="meeting-rooms-card__timeline timeline"></div>');

		$card.append([$cardTop, $cardTimeline]);
		$cardTop.append([$cardImgBlock, $cardInfo]);
		$cardImgBlock.append([$cardImgBlockImg, $cardImgBlockLabel]);
		$cardInfo.append([$cardName, $cardDesc, $cardPriceList1, $cardPriceList2]);
		$cardPriceList1.append([$cardPriceList1Variant, $cardPriceList1Price]);
		$cardPriceList2.append([$cardPriceList2Variant, $cardPriceList2Price]);

		var filterParseDate = +getDate('dd.mm.yy', state.filter['date']);
		var bookingData = [];
		var reservedData = [];
		state.bookedMeetingRoom.forEach(function(item) {
			if( item.meetingRoomId === d.id ) {
				if( +item.date === filterParseDate ) {
					bookingData = item.time;
				}
			}
		});
		state.reservedMeetingRoom.forEach(function(item) {
			if( item.meetingRoomId === d.id ) {
				if( +item.date === filterParseDate ) {
					reservedData = item.time;
				}
			}
		});

		new Timeline($cardTimeline, {
			id: state.filter['meeting_room'] + '_' + d.id,
			booking: bookingData,
			reserved: reservedData,
			update: function(time) {
				_.updateReservedMeetingRoom({
					locationId: state.filter['meeting_room'],
					meetingRoomId: d.id,
					date: ''+filterParseDate,
					time: time
				});
			}
		});

		return $card;
	}

	BookingMeetingRoom.prototype.updateReservedCards = function() {
		var _ = this;
		var state = _.store.getState();

		
	}

	BookingMeetingRoom.prototype.renderReservedCard = function() {
		var _ = this;

		var d = {
			name: 'Динамо #5',
			date: '1555016400000',
			from: 5,
			to: 6,
			amountPeople: 8
		}

		function twoNumber(n) {
			return n < 10 ? '0'+n : n;
		}

		var month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
		var date = new Date(d.date);
		var stringDay = twoNumber(date.getDate());
		var stringMonth = month[date.getMonth()];
		var stringYear = date.getFullYear();
		var stringTimeFrom = twoNumber(d.from) + ':00';
		var stringTimeTo = twoNumber(d.to) + ':00';
		var stringFullTimeFrom = stringDay + ' ' + stringMonth + ' ' + stringYear + ', ' + stringTimeFrom;
		var stringFullTimeTo = stringDay + ' ' + stringMonth + ' ' + stringYear + ', ' + stringTimeTo;

		var $block = $('<div class="right-card__block" />');
		var $blockRow1 = $('<div class="right-card__field" />');
		var $blockRow1span1 = $('<span>Переговорная</span>');
		var $blockRow1span2 = $('<span>'+ d.name +'</span>');
		var $blockRow2 = $('<div class="right-card__field" />');
		var $blockRow2span1 = $('<span>Начало аренды</span>');
		var $blockRow2span2 = $('<span>'+ stringFullTimeFrom +'</span>');
		var $blockRow3 = $('<div class="right-card__field" />');
		var $blockRow3span1 = $('<span>Окончание аренды</span>');
		var $blockRow3span2 = $('<span>'+ stringFullTimeTo +'</span>');

		$block.append([$blockRow1, $blockRow2, $blockRow3]);
		$blockRow1.append([$blockRow1span1, $blockRow1span2]);
		$blockRow2.append([$blockRow2span1, $blockRow2span2]);
		$blockRow3.append([$blockRow3span1, $blockRow3span2]);

		return $block;
	}

	BookingMeetingRoom.prototype.reducer = function(state, action) {
		switch(action.type) {
			case 'UPDATE_BOOKED_MEETING_ROOM':
				return $.extend({}, state, {
					bookedMeetingRoom: action.payload
				});
			case 'UPDATE_RESERVED_MEETING_ROOM':
				var newState = [];
				if( state.reservedMeetingRoom.length ) {
					newState = state.reservedMeetingRoom.map(function(item) {
						if( item.locationId === action.payload.locationId &&
							item.meetingRoomId === action.payload.meetingRoomId &&
							item.date === action.payload.date ) {
							var newItem = $.extend({}, item);
							newItem.time = $.extend([], action.payload.time);
							return newItem;
						} else {
							return item;
						}
					});
				} else {
					newState.push(action.payload);
				}
				return $.extend({}, state, {
					reservedMeetingRoom: newState
				});
			case 'UPDATE_FILTER_PROP':
				var newState = {};
				newState[action.payload.prop] = action.payload.value;
				return $.extend(true, {}, state, {
					filter: newState
				});
			default:
				return state;
		}
	}

	// Компонента таймлайна
	var Timeline = window.Timeline || {};

	Timeline = (function() {
		function Timeline($selector, settings) {
			var _ = this;
			
			_.$timeline = $selector;
			_.$popup = $('.meeting-rooms-form-popup');
			_.$counter = $('.js-time-counter');

			_.$popupFrom = $('.meeting-rooms-form');
			_.$popupFormClear = $('.form-settings__btn[type="clear"]');
			_.$popupFormSubmit = $('.form-settings__btn[type="submit"]');
			_.$popupFormTime = $('.form-settings__time');
			_.$popupFormHour = $('.form-settings__hour');
			_.$popupFormEditId = $('.form-settings__edit-id');
			_.$popupFormTimelintId = $('.form-settings__timeline-id');
			_.$popupFormParentPeopleCount = $('.meeting-rooms-form__people-count');
			_.$popupFormPeopleCount = $('.form-settings__people-count');
			_.$popupFormPrevState = $('.form-settings__prev-state');

			_.store = createStore(_.reducer, {
				timelineId: settings.id,
				startState: settings.booking,
				nextState: settings.reserved
			});

			_.timelineUpdate = function(nextState) {
				settings.update(nextState);
			}

			_.unsubscribe = _.store.subscribe(function () {
				_.update();
			});

			_.init();
		}
		return Timeline;
	}());

	Timeline.prototype.init = function() {
		var _ = this;
		var state = _.store.getState();

		if( state.nextState.length ) {
			_.renderSequenceFromState();
		}

		_.$timeline.append(_.renderTimeline()); // Заполняю таймлайн

		// Применение настроек в форме попапа
		_.$popupFormSubmit.on('click', function(e) {
			e.preventDefault();

			var intervalId = _.$popupFormEditId.val();
			var timelineId = _.$popupFormTimelintId.val();

			if( state.timelineId !== timelineId ) return false;
			if( intervalId === '' ) {
				_.renderNewSequence({
					id: '',
					from: +_.$popupFormTime.val(),
					to: +_.$popupFormTime.val() + +_.$popupFormHour.val(),
					place: +_.$popupFormPeopleCount.val()
				});
			} else {
				var prevState = JSON.parse(_.$popupFormPrevState.val());

				_.updateNextState({
					id: intervalId,
					from: +_.$popupFormTime.val(),
					to: +_.$popupFormTime.val() + +_.$popupFormHour.val(),
					place: +_.$popupFormPeopleCount.val()
				}, prevState);
			}

			_.$popup.switchPopup('close');
		});

		// Удаление интервала
		_.$popupFormClear.on('click', function(e) {
			e.preventDefault();

			var inputId = _.$popupFormEditId.val();
			var timelineId = _.$popupFormTimelintId.val();

			if( state.timelineId !== timelineId ) {
				_.$popup.switchPopup('close');
				return false;
			}
			if( inputId !== '' ) {
				_.removeSequence(inputId);
				_.$popup.switchPopup('close');
			}
		});
	}

	Timeline.prototype.update = function() {
		var _ = this;

		_.timelineUpdate(_.store.getState().nextState);
	}

	Timeline.prototype.renderTimeline = function() {
		var _ = this;
		var state = _.store.getState();

		var $labels = $('<div class="timeline__labels"></div>');

		for( var i = 0 ; i < 24 ; i++ ) {
			var time = i < 10 ? ('0' + i) : ('' + i);
			$labels.append('<span class="timeline__label">' + time + ':00</span>');
		}

		var $halves = $('<div class="timeline__halves"></div>');

		var holdTimeList = [];
		state.startState.forEach(function(el) {
			for( var i = +el.from ; i < +el.to ; i++ ) {
				holdTimeList.push(i);
			}
		});

		for( var i = 0 ; i < 24 ; i++ ) {
			var isHold = Boolean(holdTimeList.filter(function(el) {
				if( el === i ) return true;
			}).length);

			var className = isHold ? 'timeline__half timeline__half_hold' : 'timeline__half';
			var $half = $('<span class="'+ className +'" data-timeline-time="'+ i +'"></span>');

			$halves.append($half);
		}

		$halves.on('click', function(e) {
			var $half = $(e.target);
			if( !$half.hasClass('timeline__half_hold') ) {
				_.booking(+$half.data('timeline-time'));
			}
		});

		return [
			$labels,
			$halves
		];
	}

	Timeline.prototype.booking = function(time) {
		var _ = this;
		var state = _.store.getState();

		_.$popupFormTime.val(time);
		
		// Обнуление состояний
		_.$popupFormEditId.val(''); // id текущего интервала
		_.$popupFormTimelintId.val(state.timelineId); // id текущего таймлайна
		_.$popupFormTime.val(time); // Начало интервала
		_.$counter.formfieldCounter('setOption', 'value', '1'); // Кол-во часов в интервале
		window.updateFormselect(_.$popupFormParentPeopleCount) // Количество мест
		_.$popupFormPrevState.val(''); // Предыдущее состояние
		_.$popupFormClear.text('Отменить'); // Кнопка закрывающая попап

		_.$popup.switchPopup('open');
	}

	Timeline.prototype.removeSequence = function(id) {
		var _ = this;

		_.store.dispatch({
			type: 'REMOVE_INTERVAL_IN_NEXT_STATE',
			payload: id
		});
		_.renderSequenceFromState();
	}

	Timeline.prototype.renderNewSequence = function(interval) {
		var _ = this;

		_.renderSequence({
			interval: interval,
			update: function(state) {
				_.updateNextState(state.nextState, state.prevState);
			}
		});
		
		_.updateNextState(interval);
	}

	Timeline.prototype.renderSequenceFromState = function() {
		var _ = this;
		var state = _.store.getState();

		_.$timeline.children('.timeline__sequence').remove();

		state.nextState.forEach(function(interval) {
			var $sequence = _.renderSequence({
				interval: interval,
				update: function(state) {
					_.updateNextState(state.nextState, state.prevState);
				}
			});
			
			_.$timeline.append($sequence);
		});
	}

	Timeline.prototype.updateNextState = function(nextState, prevState) {
		var _ = this;

		_.store.dispatch({
			type: 'UPDATE_INTERVAL_IN_NEXT_STATE',
			payload: _.validateTime(nextState, prevState)
		});
		_.renderSequenceFromState();
	}

	Timeline.prototype.renderSequence = function(props) {
		var _ = this;

		var interval = props.interval;
		var update = props.update;

		var $sequence = $('<div class="timeline__sequence"></div>');
		var $sequenceStart = $('<span class="timeline__sequence-handle-start"></span>');
		var $sequenceEnd = $('<span class="timeline__sequence-handle-end"></span>');

		$sequence.append([
			$sequenceStart,
			$sequenceEnd
		]);

		var sequenceID = interval.id !== '' ? interval.id : _.generateSequenceId();
		var time = interval.from;
		var count = interval.to - interval.from;

		var sequenceWidthOne = 60; // Размер одного деления
		var sequenceWidth = sequenceWidthOne * count; // Длина временного отрезка в пикселях
		var sequencePositionLeft = sequenceWidthOne * time; // Позиция временного отрезка в пикселях
		var sequenceWidthStart = sequenceWidth; // Начальная длина временного отрезка в пикселях (для изменения)
		var sequencePositionLeftStart = sequencePositionLeft; // Начальная позиция временного отрезка в пикселях (для изменения)
		var mouseDownStart = 0; // Координата начала движения мыши (для изменения)
		var sequenceIsDown = false; // Передвигаю временной отрезок
		var sequenceStartIsDown = false; // Изменяю длину временного отрезка (от начала)
		var sequenceEndIsDown = false; // Изменяю длину временного отрезка (от конца)
		var returnTime = time; // Возвращаемое начало временного отрезка
		var returnCount = count; // Возвращаемое количество часов временного отрезка

		var prevState = {
			id: sequenceID,
			from: Math.floor(interval.from),
			to: Math.floor(interval.to),
			place: interval.place
		};

		$sequence[0].style.width = sequenceWidth + 'px';
		$sequence[0].style.left = sequencePositionLeft + 'px';

		// Перевод положения в пикселях в реальные часы
		function pixelToHour(px) {
			return px / sequenceWidthOne;
		}

		$sequence.on('mousedown', function(e) {
			var eClassList = e.target.classList;

			var state = _.store.getState();
			var nextStateInterval = state.nextState.filter(function(interval) {
				if( interval.id === sequenceID ) return true;
			})[0];

			if( eClassList.contains('timeline__sequence-handle-start') ) { // Начали тянуть левую часть
				sequenceStartIsDown = true;
				mouseDownStart = e.clientX;
				sequenceWidthStart = parseInt($sequence[0].style.width);
				sequencePositionLeftStart = parseInt($sequence[0].style.left);
			} else if( eClassList.contains('timeline__sequence-handle-end') ) { // Начали тянуть правую часть
				sequenceEndIsDown = true;
				mouseDownStart = e.clientX;
				sequenceWidthStart = parseInt($sequence[0].style.width);
			} else { // Начали тянуть весь блок
				sequenceIsDown = true;
				mouseDownStart = e.clientX;
				sequencePositionLeftStart = parseInt($sequence[0].style.left);
			}
			prevState = {
				id: sequenceID,
				from: pixelToHour(sequencePositionLeftStart),
				to: pixelToHour(sequencePositionLeftStart + sequenceWidthStart),
				place: nextStateInterval.place
			};
		});

		$sequence.on('click', function() {
			var state = _.store.getState();
			var nextStateInterval = state.nextState.filter(function(interval) {
				if( interval.id === sequenceID ) return true;
			})[0];

			// Устанавливаю текущие значения в попап
			_.$popupFormEditId.val(sequenceID); // id текущего интервала
			_.$popupFormTimelintId.val(state.timelineId); // id текущего таймлайна
			_.$popupFormTime.val(returnTime); // Начало интервала
			_.$counter.formfieldCounter('setOption', 'value', returnCount); // Кол-во часов в интервале
			window.updateFormselect(_.$popupFormParentPeopleCount, nextStateInterval.place) // Количество мест
			_.$popupFormPrevState.val(JSON.stringify(prevState)); // Предыдущее состояние
			_.$popupFormClear.text('Удалить'); // Кнопка удаляющая интервал

			_.$popup.switchPopup('open');
		});

		$(document).on('mousemove', function(e) {
			if( sequenceIsDown ) { // Зажата вся полоска
				if( mouseDownStart >= e.clientX ) { // Тянем в лево
					sequencePositionLeft = sequencePositionLeftStart - (mouseDownStart - e.clientX);
				} else { // Тянем в право
					sequencePositionLeft = sequencePositionLeftStart + (e.clientX - mouseDownStart);
				}
				$sequence[0].style.left = sequencePositionLeft + 'px';
			}

			if( sequenceStartIsDown ) { // Зажата левая тягалка
				if( mouseDownStart >= e.clientX ) { // Тянем в лево
					sequenceWidth = sequenceWidthStart + (mouseDownStart - e.clientX);
					sequencePositionLeft = sequencePositionLeftStart - (mouseDownStart - e.clientX);
				} else { // Тянем в право
					sequenceWidth = sequenceWidthStart - (e.clientX - mouseDownStart);
					sequencePositionLeft = sequencePositionLeftStart + (e.clientX - mouseDownStart);
				}
				$sequence[0].style.width = sequenceWidth + 'px';
				$sequence[0].style.left = sequencePositionLeft + 'px';
			}

			if( sequenceEndIsDown ) { // Зажата правая тягалка
				sequenceWidth = sequenceWidthStart + (e.clientX - mouseDownStart);
				$sequence[0].style.width = sequenceWidth + 'px';
			}
		});

		$(document).on('mouseup', function() {
			var state = _.store.getState();
			var nextStateInterval = state.nextState.filter(function(interval) {
				if( interval.id === sequenceID ) return true;
			})[0];

			if( sequenceIsDown || sequenceStartIsDown ) {
				sequencePositionLeft = Math.round(sequencePositionLeft / sequenceWidthOne) * sequenceWidthOne;
				$sequence[0].style.left = sequencePositionLeft + 'px';
			}
			if( sequenceEndIsDown || sequenceStartIsDown ) {
				sequenceWidth = Math.round(sequenceWidth / sequenceWidthOne) * sequenceWidthOne;
				$sequence[0].style.width = sequenceWidth + 'px';
			}
			if( sequenceIsDown || sequenceStartIsDown || sequenceEndIsDown ) {
				returnTime = sequencePositionLeft / sequenceWidthOne;
				returnCount = sequenceWidth / sequenceWidthOne;

				if( sequenceWidthStart !== sequenceWidth || sequencePositionLeftStart !== sequencePositionLeft ) {
					update({
						nextState: {
							id: sequenceID,
							from: returnTime,
							to: returnTime + returnCount,
							place: nextStateInterval.place
						},
						prevState: prevState
					});
				}
	
				sequenceIsDown = false;
				sequenceEndIsDown = false;
				sequenceStartIsDown = false;
				mouseDownStart = 0;
			}
		});

		return $sequence[0];
	}

	Timeline.prototype.validateTime = function(nextState, prevState) {
		var _ = this;
		var state = _.store.getState();

		/**
		 * Статусы:
		 * 0 - свободно
		 * 1 - занято другими пользователями
		 * 2 - занято текущим пользователем, может быть объединено
		 */

		var timeline = [];
		var resultTimeline = [];
		for( var i = 0 ; i < 24 ; i++ ) {
			timeline[i] = {
				state: 0,
				place: 0
			};
		}

		// Добавляю стартовые интервалы занятые другими пользователями
		state.startState.forEach(function(interval) {
			for( var i = +interval.from ; i < +interval.to ; i++ ) {
				timeline[i] = {
					state: 1,
					place: 0
				};
			}
		});

		// Добавляю интервалы добавленные текущим пользователем
		state.nextState.forEach(function(interval) {
			for( var i = interval.from ; i < interval.to ; i++ ) {
				timeline[i] = {
					state: 2,
					place: interval.place
				};
			}
		});

		// Если было предыдущее состояние у интервала, его нужно очистить
		if( typeof prevState !== 'undefined' ) {
			for( var i = prevState.from ; i < prevState.to ; i++ ) {
				if( timeline[i].state === 2 ) {
					timeline[i] = {
						state: 0,
						place: 0
					};
				}
			}
		}

		// Добавляю текущее состояние интервала
		for( var i = nextState.from ; i < nextState.to ; i++ ) {
			if( timeline[i].state !== 1 ) {
				timeline[i] = {
					state: 2,
					place: nextState.place
				};
			}
		}

		// Объединяю интервалы текущего пользователя
		for( var i = 0, maxPlace = 0 ; i < 24 ; i++, maxPlace = 0 ) {
			if( timeline[i].state === 2 ) {
				maxPlace = timeline[i].place;
				var from = i;
				var to = i + 1;
				if( i !== 23 ) {
					for( var j = i + 1 ; j < 24 ; j++ ) {
						if( timeline[j].state === 2 && maxPlace < timeline[j].place ) {
							maxPlace = timeline[j].place;
						}
						if( timeline[j].state !== 2 ) {
							to = j;
							i = j;
							break;
						}
						if( timeline[j].state === 2 && j === 23 ) {
							to = j + 1;
							i = j;
							break;
						}
					}
				}
				resultTimeline.push({
					id: _.generateSequenceId(),
					from: from,
					to: to,
					place: maxPlace
				});
			}
		}

		return resultTimeline;
	}
	
	Timeline.prototype.generateSequenceId = function() {
		return 'xxxxxxxxxxxxxxxxxxxx'.replace( /[xy]/g, function(c) {
			var r = Math.random() * 16 | 0;
			return ( c == 'x' ? r : ( r & 0x3 | 0x8 ) ).toString(16);
		});
	};

	Timeline.prototype.reducer = function(state, action) {
		switch(action.type) {
			case 'UPDATE_INTERVAL_IN_NEXT_STATE':
				return $.extend({}, state, {
					nextState: action.payload
				});
			case 'REMOVE_INTERVAL_IN_NEXT_STATE':
				var nextState = state.nextState.filter(function(interval) {
					if( interval.id !== action.payload ) return true;
				});
				return $.extend({}, state, {
					nextState: nextState
				});
			default:
				return state;
		}
	}

	$(document).ready(function() {
		$('.meeting-rooms-form-popup').switchPopup({
			btnClass: 'js-tgl-meeting-popup',
			duration: 300
		});
	
		$('.js-time-counter').formfieldCounter({
			value: 1,
			min: 1,
			max: 24,
			plusSelector: '.form-settings__count-plus',
			minusSelector: '.form-settings__count-minus',
			inputSelector: '.form-settings__hour'
		});
	
		new BookingMeetingRoom({
			locationData: locationData
		});
	});

});
