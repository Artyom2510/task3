$(document).ready(function(){
	$('.datepicker').datepicker({
		beforeShow: function(){
			setTimeout(function(){
					$('.ui-datepicker').css('z-index', 4);
			}, 0);
		},
		dateFormat: "dd.mm.yy",
		monthNames : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		dayNamesMin : ['Вс', 'Пн','Вт','Ср','Чт','Пт','Сб'],
		dayNames: ['Воскресенье', 'Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
		firstDay: 1,
		showOtherMonths: true,
		selectOtherMonths: true,
		minDate: 0,
	});
	$('.datepicker').inputmask();
});
