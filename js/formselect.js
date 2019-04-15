$(function() {
	// Выпадающий список (радиокнопки замаскированные под select)
	// Открытие выпадашки по клику на нее
	$(document).on('click', '.formselect-radio__value, .formselect-radio__arrow', function() {
		var $parent = $(this).parent('.formselect-radio');
		if(!$parent.hasClass('form-wraper_disabled')) {
			$parent.toggleClass('open');
		}
	});
	// Закрытие выпадашки по клику вне нее
	$(document).on('click', function(event) {
		var $formselectRadioAll = $('.formselect-radio.open');
		var $formselectRadio = $(event.target).closest('.formselect-radio.open');
		if( $formselectRadio.length ) { // Если клик внутри formselect-radio
			if( $formselectRadioAll.length > 1 ) // Если было открыто больше 1 formselect-radio
				$formselectRadioAll.not($formselectRadio).removeClass('open'); // Закрытие всех formselect-radio кроме только что открытого
			return;
		}
		$formselectRadioAll.removeClass('open');
		event.stopPropagation();
	});
	// Меняет value выпадашки
	function updateSelectRadioValue(input) {
		var $parent = $(input).parents('.formselect-radio');
		var $value = $parent.children('.formselect-radio__value');
		var $input = $parent.children('.formselect-radio__input');
		var text = $(input).next('label').text();
		var value = $(input).val();
		$value.children().text(text);
		$value.attr('title', text);
		$input.val(value).trigger('change');
		return $parent;
	}
	// Обработка инпутов внутри выпадашки
	$(document).on('change', '.formselect-radio__item input', function() {
		var $parent = updateSelectRadioValue(this);
		$parent.removeClass('open');
	});
	$(document).on('click', '.formselect-radio__item input:checked', function() {
		var $parent = updateSelectRadioValue(this);
		$parent.removeClass('open');
	});
	// Устанавливает value после загрузки страницы
	$(document).ready(function() {
		$('.formselect-radio__item input:checked').each(function(id, input) {
			updateSelectRadioValue(input);
		});
	});

	window.updateFormselect = function($parent, value) {
		var $value = $parent.children('.formselect-radio__value');
		var $input = $parent.children('.formselect-radio__input');
		var text;
		if( typeof value !== 'undefined' ) {
			var $findInput = $parent.find('input[type="radio"][value="'+value+'"]');
			text = $findInput.next('label').text();
			$findInput.prop('checked', true);
			$input.val(value);
		} else {
			var $firstInput = $parent.find('input[type="radio"]').first();
			text = $firstInput.next('label').text();
			$input.val($firstInput.val());
		}
		$value.children().text(text);
		$value.attr('title', text);
	}
});
