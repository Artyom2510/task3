;(function($) {
	var FormfieldSelect = window.FormfieldSelect || {};
	FormfieldSelect = (function() {
		function FormfieldSelect(element, settings) {
			var _ = this;
			
			_.initOption = {
				open: false,
				disabled: false,
				btnSelector: '.formselect-radio__arrow',
				valueSelector: '.formselect-radio__value',
				inputSelector: '.formselect-radio__input',
				listSelector: '.formselect-radio__list',
				itemSelector: '.formselect-radio__item'
			};
			_.option = $.extend({}, _.initOption, settings);

			_.$select = $(element);
			_.$button = _.$select.children(_.option.btnSelector);
			_.$value = _.$select.children(_.option.valueSelector);
			_.$input = _.$select.children(_.option.inputSelector);
			_.$list = _.$select.children(_.option.listSelector);
			_.$item = _.$select.children(_.option.itemSelector);

			_.init();
		}
		return FormfieldSelect;
	}());

	FormfieldSelect.prototype.init = function() {
		var _ = this;
		var option = _.option;

		_.$button.on('click', function() {
			var $parent = $(this).parent(_.$select);
			if( !option.disabled ) {
				$parent.toggleClass('open');
			}
			_.update();
		});

		_.$value.on('click', function() {
			console.log('ddd');
			var $parent = $(this).parent(_.$select);
			if( !option.disabled ) {
				$parent.toggleClass('open');
			}
			_.update();
		});

		// _.$item.find('input').on('change', function() {
		// 	console.log('bbbbb');
		// 	var $parent = _.updateSelectRadioValue(this);
		// 	$parent.removeClass('open');
		// });

		// _.$item.find('input:checked').on('click', function() {
		// 	console.log('aaaaaa');
		// 	var $parent = _.updateSelectRadioValue(this);
		// 	$parent.removeClass('open');
		// });

		// $(document).ready(function() {
		// 	_.$item.find('input:checked').each(function(id, input) {
		// 		updateSelectRadioValue(input);
		// 	});
		// });
		$('.formselect-radio__item').children('input').on('change', function() {
			console.log('bbbbb');
			var $parent = _.updateSelectRadioValue(this);
			$parent.removeClass('open');
		});

		$('.formselect-radio__item').children('input:checked').on('click', function() {
			console.log('aaaaaa');
			var $parent = _.updateSelectRadioValue(this);
			$parent.removeClass('open');
		});

		$(document).ready(function() {
			$('.formselect-radio__item').children('input:checked').each(function(id, input) {
				_.updateSelectRadioValue(input);
			});
		});

	}
	FormfieldSelect.prototype.update = function() {
		var _ = this;
		$(document).on('click', function(event) {
			// var $formselectRadioAll = $('.formselect-radio.open');
			var $formselectRadioAll = _.$select.filter('.open');
			var $formselectRadio = $(event.target).closest(_.$select.filter('.open'));
			if( $formselectRadio.length ) { // Если клик внутри formselect-radio
				if( $formselectRadioAll.length > 1 ) // Если было открыто больше 1 formselect-radio
					$formselectRadioAll.not($formselectRadio).removeClass('open'); // Закрытие всех formselect-radio кроме только что открытого
				return;
			}
			$formselectRadioAll.removeClass('open');
			event.stopPropagation();
		});
	}
	FormfieldSelect.prototype.updateSelectRadioValue = function(input) {
		var _ = this;
		// var $parent = $(input).parents(_.$select);
		// var $value1 = $parent.children(_.$value);
		// var $input1 = $parent.children(_.$input);
		var $parent = $(input).parents('.formselect-radio');
		console.log($parent);
		var $value1 = $parent.children('.formselect-radio__value');
		var $input1 = $parent.children('.formselect-radio__input');
		var text = $(input).next('label').text();
		var value = $(input).val();
		$value1.children().text(text);
		$value1.attr('title', text);
		$input1.val(value).trigger('change');
		return $parent;
	}

	$.fn.formfieldSelect = function() {
		var _ = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		
		for( i = 0; i < l; i++ ) {
			if( typeof opt == 'object' || typeof opt == 'undefined' ) {
				_[i].formfieldSelect = new FormfieldSelect(_[i], opt);
			} else {
				ret = _[i].formfieldSelect[opt].apply(_[i].formfieldSelect, args);
			}
			if( typeof ret != 'undefined' ) return ret;
		}
		return _;
	}

		// Выпадающий список (радиокнопки замаскированные под select)
		// Открытие выпадашки по клику на нее
		// $(document).on('click', '.formselect-radio__value, .formselect-radio__arrow', function() {
		// 	var $parent = $(this).parent('.formselect-radio');
		// 	if( !$parent.hasClass('form-wraper_disabled') ) {
		// 		$parent.toggleClass('open');
		// 	}
		// });
		// Закрытие выпадашки по клику вне нее

		// // Меняет value выпадашки
		// function updateSelectRadioValue(input) {
		// 	var $parent = $(input).parents('.formselect-radio');
		// 	var $value = $parent.children('.formselect-radio__value');
		// 	var $input = $parent.children('.formselect-radio__input');
		// 	var text = $(input).next('label').text();
		// 	var value = $(input).val();
		// 	$value.children().text(text);
		// 	$value.attr('title', text);
		// 	$input.val(value).trigger('change');
		// 	return $parent;
		// }
		// // Обработка инпутов внутри выпадашки
		// $(document).on('change', '.formselect-radio__item input', function() {
		// 	var $parent =	updateSelectRadioValue(this);
		// 	$parent.removeClass('open');
		// });
		// $(document).on('click', '.formselect-radio__item input:checked', function() {
		// 	var $parent =	updateSelectRadioValue(this);
		// 	$parent.removeClass('open');
		// });
		// // Устанавливает value после загрузки страницы
		// $(document).ready(function() {
		// 	$('.formselect-radio__item input:checked').each(function(id, input) {
		// 		updateSelectRadioValue(input);
		// 	});
		// });

		// window.updateFormselect = function($parent, value) {
		// 	var $value = $parent.children($value);
		// 	var $input = $parent.children($input);
		// 	var text;
		// 	if( typeof value !== 'undefined' ) {
		// 		var $findInput = $parent.find('input[type="radio"][value="'+value+'"]');
		// 		text = $findInput.next('label').text();
		// 		$findInput.prop('checked', true);
		// 		$input.val(value);
		// 	} else {
		// 		var $firstInput = $parent.find('input[type="radio"]').first();
		// 		text = $firstInput.next('label').text();
		// 		$input.val($firstInput.val());
		// 	}
		// 	$value.children().text(text);
		// 	$value.attr('title', text);
		// }
})(jQuery);
