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

	var Timeline = window.Timeline || {};

	Timeline = (function() {
		function Timeline(selector, settings) {
			var _ = this;
			
			_.$timeline = $(selector);
			_.$popup = $('.meeting-rooms-form-popup');

			_.store = createStore(_.reducer, {
				startState: settings.data,
				nextState: []
			});

			_.unsubscribe = _.store.subscribe(function () {
				_.update();
			});

			_.init();
		}
		return Timeline;
	}());

	Timeline.prototype.init = function() {
		var _ = this;

		_.$timeline.append(_.renderTimeline()); // Заполняю таймлайн

		console.log(_.store.getState());
	}

	Timeline.prototype.update = function() {
		var _ = this;

		console.log(_.store.getState());
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

		// _.$popup.switchPopup('open');
		_.renderNewSequence({
			from: time,
			to: time + 1
		});
	}

	Timeline.prototype.renderNewSequence = function(interval) {
		var _ = this;

		_.renderSequence({
			interval: interval,
			update: function(state) {
				_.updateNextState(state.nextState);
			}
		});
		
		_.updateNextState(interval);
	}

	Timeline.prototype.renderSequenceFromState = function() {
		var _ = this;
		var state = _.store.getState();

		_.$timeline.children('.timeline__sequence').remove();

		console.log('render all', state.nextState);
		state.nextState.forEach(function(interval) {
			var $sequence = _.renderSequence({
				interval: interval,
				update: function(state) {
					_.updateNextState(state.nextState);
				}
			});
			
			_.$timeline.append($sequence);
		});
	}

	Timeline.prototype.updateNextState = function(interval) {
		var _ = this;

		console.log('update', interval);
		_.store.dispatch({
			type: 'UPDATE_NEXT_STATE',
			payload: _.validateTime(interval)
		});
		_.renderSequenceFromState();
	}

	Timeline.prototype.renderSequence = function(props) {
		var interval = props.interval;
		var update = props.update;

		var $sequence = $('<div class="timeline__sequence"></div>');
		var $sequenceStart = $('<span class="timeline__sequence-handle-start"></span>');
		var $sequenceEnd = $('<span class="timeline__sequence-handle-end"></span>');

		$sequence.append([
			$sequenceStart,
			$sequenceEnd
		]);

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
			from: interval.from,
			to: interval.to
		};

		$sequence[0].style.width = sequenceWidth + 'px';
		$sequence[0].style.left = sequencePositionLeft + 'px';

		$sequence.on('mousedown', function(e) {
			var eClassList = e.target.classList;

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
				from: sequencePositionLeftStart / sequenceWidthOne,
				to: (sequencePositionLeftStart + sequenceWidthStart) / sequenceWidthOne
			};
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
				update({
					nextState: {
						from: returnTime,
						to: returnTime + returnCount
					},
					prevState: prevState
				});
	
				sequenceIsDown = false;
				sequenceEndIsDown = false;
				sequenceStartIsDown = false;
				mouseDownStart = 0;
			}
		});

		return $sequence[0];
	}

	Timeline.prototype.validateTime = function(newInterval) {
		var _ = this;
		var state = _.store.getState();

		var timeline = [];
		var resultTimeline = [];
		for( var i = 0 ; i < 24 ; i++ ) {
			timeline[i] = 0;
		}

		state.startState.forEach(function(interval) {
			for( var i = +interval.from ; i < +interval.to ; i++ ) {
				timeline[i] = 1;
			}
		});

		state.nextState.forEach(function(interval) {
			for( var i = interval.from ; i < interval.to ; i++ ) {
				timeline[i] = 2;
			}
		});

		for( var i = newInterval.from ; i < newInterval.to ; i++ ) {
			if( timeline[i] !== 1 ) timeline[i] = 2;
		}

		for( var i = 0 ; i < 23 ; i++ ) {
			if( timeline[i] === 2 ) {
				var from = i;
				var to = i + 1;
				for( var j = i + 1 ; j < 23 ; j++ ) {
					if( timeline[j] !== 2 ) {
						to = j;
						i = j;
						break;
					}
				}
				resultTimeline.push({
					from: from,
					to: to
				});
			}
		}

		return resultTimeline;
	}

	Timeline.prototype.reducer = function(state, action) {
		switch(action.type) {
			case 'UPDATE_NEXT_STATE':
				return $.extend({}, state, {
					nextState: action.payload
				});
			default:
				return state;
		}
	}

	var timelineDataArray = [
		{
			from: '9',
			to: '12'
		}
	];

	new Timeline('.timeline-1', {
		data: timelineDataArray
	});

	$('.meeting-rooms-form-popup').switchPopup({
		btnClass: 'js-tgl-meeting-popup',
		duration: 300
	});

});
