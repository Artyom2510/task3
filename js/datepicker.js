$(document).ready(function(){
	$('.datepicker').datepicker({
		beforeShow: function(){
			setTimeout(function(){
					$('.ui-datepicker').css('z-index', 4);
			}, 0);
		},
		dateFormat : 'DD, d MM yy',
		monthNames : ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'],
		dayNamesMin : ['Вс', 'Пн','Вт','Ср','Чт','Пт','Сб'],
		dayNames: ['Воскресенье', 'Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
		firstDay: 1,
		showOtherMonths: true,
		selectOtherMonths: true,
		minDate: 0,
	});
	var d = new Date().getDate();
	var y = new Date().getFullYear();
	var month = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
	var m = month[new Date().getMonth()];
	document.getElementsByClassName('.datepicker').placeholder = 'Сегодня, ' + d + ' ' + m + ' ' + y;
});
