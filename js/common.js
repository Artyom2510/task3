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
		function Timeline(element, settings) {
			var _ = this;
			
			_.$timeline = $(element);

			_.store = createStore(_.reducer, {
				data: settings.data
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
		state.data.forEach(function(el) {
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
		console.log('Бронирую ' + time);
	}

	Timeline.prototype.reducer = function(state, action) {
		switch(action.type) {
			// case 'CHOOSE_OFFICE_DATA_SUCCESS':
			// 	return $.extend({}, state, {
			// 		data: action.payload
			// 	});
			default:
				return state;
		}
	}

	var timelineDataArray = [
		{
			from: '9',
			to: '10'
		}
	];

	new Timeline('.timeline-1', {
		data: timelineDataArray
	});

});
