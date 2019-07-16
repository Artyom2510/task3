// Выпадающий список (радиокнопки замаскированные под select)
;(function($) {
	var FormfieldSelect = window.FormfieldSelect || {};
	FormfieldSelect = (function() {
		function FormfieldSelect(element, settings) {
			var _ = this;
			
			_.initOption = {
				open: false,
				close: true,
				disabled: false,
				type: 'select',
				btnSelector: '.formselect-radio__arrow',
				valueSelector: '.formselect-radio__value',
				inputSelector: '.formselect-radio__input',
				listSelector: '.formselect-radio__list',
				itemSelector: '.formselect-radio__item',
			};
			_.option = $.extend({}, _.initOption, settings);
			
			_.$select = $(element);
			_.$button = _.$select.find(_.option.btnSelector);
			_.$value = _.$select.find(_.option.valueSelector);
			_.$input = _.$select.find(_.option.inputSelector);
			_.$list = _.$select.find(_.option.listSelector);
			_.$item = _.$select.find(_.option.itemSelector);
			inputChecked = _.$item.find('input:checked');
			itemLabel = _.$item.find('label');
			itemLink = _.$item.find('a');
			arrayOfLabel = [];

			_.init();
		}
		return FormfieldSelect;
	}());

	FormfieldSelect.prototype.init = function() {
		var _ = this;
		var option = _.option;

		// Открытие и закрытие выпадашки по клику на нее
		_.$button.on('click', function() {
			if( !option.disabled ) {
				_.$select.toggleClass('open');
			}
			_.update();
		});

		_.$value.on('click', function() {
			if( !option.disabled ) {
				_.$select.toggleClass('open');
			}
			_.update();
		});

		//Изначально закрыт
		if( option.close ) {
			_.$select.removeClass('open');
		}

		//Изначально открыт
		if( option.open ) {
			_.$select.addClass('open');
		}

		//Обычный селект
		if( option.type === 'select' ) {
			inputChecked.on('change', function() {
				_.updateSelectRadioValue(this).removeClass('open');
			});
	
			// Обработка инпутов, ссылок внутри выпадашки
			itemLabel.on('click', function() {
				_.updateSelectRadioValue(this).removeClass('open');
			});
			itemLink.on('click', function() {
				_.$item.find('a').removeClass('active');
				$(this).addClass('active');
				_.updateSelectRadioValue(this).removeClass('open');
			});
	
			 // Устанавливает value после загрузки страницы
			$(document).ready(function() {
				_.$item.find('input:checked').each(function(id, input) {
					_.updateSelectRadioValue(input);
				});
			});
			$(document).ready(function() {
				_.$item.find('a.active').each(function(id, input) {
					_.updateSelectRadioValue(input);
				});
			});
		}

		//Мультиселект
		if( option.type === 'multiple' ) {
			// Устанавливает value после загрузки страницы
			$(document).ready(function() {
				inputChecked = _.$item.find('input:checked');
				inputCheckedLength = inputChecked.length;
				inputChecked.each(function() {
					var label = inputChecked.siblings('label');
					_.updateSelectMultipleValue(inputCheckedLength, label);
					_.updateSelectMultipleArrayOfLabel(inputCheckedLength, label);
				});
			});

			_.$item.find('input').on('change', function() {
				checkedInput = _.$item.find('input:checked');
				inputCheckedLength = checkedInput.length;
				var label = checkedInput.siblings('label');
				_.updateSelectMultipleValue(inputCheckedLength, label);
				_.updateSelectMultipleArrayOfLabel(inputCheckedLength, label);
			});
		}

	}
	FormfieldSelect.prototype.update = function() {
		var _ = this;
		$(document).on('click', function(event) {
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

	// Меняет value выпадашки
	FormfieldSelect.prototype.updateSelectRadioValue = function(input) {
		var _ = this;
		var text = $(input).next('label').text() || $(input).text();
		var value = $(input).val();
		_.$value.children().text(text);
		_.$value.attr('title', text);
		_.$input.val(value).trigger('change');
		return _.$select;
	}

	FormfieldSelect.prototype.updateSelectMultipleArrayOfLabel = function(inputCheckedLength, label) {
		var _ = this, value;
		var arrayOfLabel = new Array();
		for( i = 0; i < inputCheckedLength; i++) {
			arrayOfLabel[i] = " " + $(label[i]).text();
		}
		if( arrayOfLabel.length ) value = arrayOfLabel;
		else value = 'ничего не выбранно';
		_.$value.attr('title', value);
		return _.$select;
	}

	FormfieldSelect.prototype.updateSelectMultipleValue = function(length, label) {
		var _ = this, text;
		var substr1 = 'выбран';
		var substr2 = ' пункт';
		if( !length ) {
			text = "ничего не выбранно";
		} else if( length === 1 ) {
			text = $(label).text();
		} else if( length % 10 === 1 && length > 20 ) {
			text = substr1 + " " + length + " " + substr2;
		} else if( (length % 10 === 2 || length % 10 === 3 || length % 10 === 4) && ( length < 5 || length > 21 ) ) {
			text = substr1 + "но " + length + substr2 +'a\n'; 
		} else {
			text = substr1 + "но " + length + substr2 +'ов\n';
		}
		_.$value.children().text(text);
		return _.$select;
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

})(jQuery);

