;(function($) {
	var FormfieldCounter = window.FormfieldCounter || {};
	
	FormfieldCounter = (function() {
		function FormfieldCounter(element, settings) {
			var _ = this;
			
			_.initOption = {
				value: 1,
				min: null,
				max: null,
				plusSelector: '.counter__plus',
				minusSelector: '.counter__minus',
				inputSelector: '.counter__input',
				valueSelector: '.counter__value'
			};
			_.option = $.extend({}, _.initOption, settings);
	
			_.$counter = $(element);
			_.$plus = _.$counter.children(_.option.plusSelector);
			_.$minus = _.$counter.children(_.option.minusSelector);
			_.$input = _.$counter.children(_.option.inputSelector);
			_.$value = _.$counter.children(_.option.valueSelector);
		
			_.init();
		}
		return FormfieldCounter;
	}());

	FormfieldCounter.prototype.init = function() {
		var _ = this;
		var option = _.option;
	
		if( option.min === null ) {
			if( !!_.$input.attr('min') ) {
				_.option.min = _.$input.attr('min');
			}
		} else {
			if( !_.$input.attr('min') ) {
				_.$input.attr('min', option.min);
			}
		}
	
		if( option.max === null ) {
			if( !!_.$input.attr('max') ) {
				_.option.max = _.$input.attr('max');
			}
		} else {
			if( !_.$input.attr('max') ) {
				_.$input.attr('max', option.max);
			}
		}
	
		if( option.value === 1 ) {
			if( !!_.$input.attr('value') ) {
				_.option.value = _.$input.val();
				if(_.$value.length) _.$value.text(_.option.value);
			} else {
				_.$input.val(option.value);
				if(_.$value.length) _.$value.text(option.value);
			}
		} else {
			_.$input.val(option.value);
			if(_.$value.length) _.$value.text(option.value);
		}
	
		_.$plus.on('click', function() {
			_.option.value++;
			_.$input.val(_.option.value);
			if(_.$value.length) _.$value.text(_.option.value);
			_.update();
		});
	
		_.$minus.on('click', function() {
			_.option.value--;
			_.$input.val(_.option.value);
			if(_.$value.length) _.$value.text(_.option.value);
			_.update();
		});

		_.$input.on('input', function(e) {
			var value = +e.target.value;

			if( value < 0 && value < +_.option.min ) {
				value = +_.option.min;
			}

			if( value >= +_.option.min ) {
				_.option.value = value;
				_.$input.val(value);
				if(_.$value.length) _.$value.text(value);
			} else {
				_.option.value = _.option.min;
				_.$input.val(_.option.min);
				if(_.$value.length) _.$value.text(_.option.min);
			}

			if( value <= +_.option.max ) {
				_.option.value = value;
				_.$input.val(value);
				if(_.$value.length) _.$value.text(value);
			} else {
				_.option.value = _.option.max;
				_.$input.val(_.option.max);
				if(_.$value.length) _.$value.text(_.option.max);
			}

			_.update();
		});

		_.$input.on('blur', function(e) {
			var value = e.target.value;

			if( value === '' || +value === 0 ) {
				_.option.value = _.option.min;
				_.$input.val(_.option.min);
			}

			_.update();
		});

		_.update();
	}
	
	FormfieldCounter.prototype.update = function() {
		var _ = this;
	
		if( _.option.min !== null && +_.option.value === +_.option.min ) {
			_.$minus.prop('disabled', true);
		} else {
			_.$minus.prop('disabled', false);
		}
	
		if( _.option.max !== null && +_.option.value === +_.option.max ) {
			_.$plus.prop('disabled', true);
		} else {
			_.$plus.prop('disabled', false);
		}

		_.$counter.trigger('update', [_.$counter, _.option.value]);
	}

	FormfieldCounter.prototype.setOption = function(option, value) {
		var _ = this;

		_.option[option] = value;
		_.$input.attr(option, value);

		if( option === 'value' ) _.update();
	}

	$.fn.formfieldCounter = function() {
		var _ = this,
				opt = arguments[0],
				args = Array.prototype.slice.call(arguments, 1),
				l = _.length,
				i,
				ret;

		for (i = 0; i < l; i++) {
			if (typeof opt == 'object' || typeof opt == 'undefined') {
				_[i].formfieldCounter = new FormfieldCounter(_[i], opt);
			} else {
				ret = _[i].formfieldCounter[opt].apply(_[i].formfieldCounter, args);
			}
			if (typeof ret != 'undefined') return ret;
		}
		return _;
	};
})(jQuery);
