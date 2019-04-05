$(document).ready(function(){
	$('.datepicker').datepicker({
		dateFormat : "yy-mm-dd",
		monthNames : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		dayNamesMin : ['Вс', 'Пн','Вт','Ср','Чт','Пт','Сб'],
		dayNames: ['воскресенье', 'понедельник','вторник','среда','четверг','пятница','суббота'],
		firstDay: 1,
		showOtherMonths: true,
		selectOtherMonths: true,
		minDate: 0
	});
});
