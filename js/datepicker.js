$(document).ready(function(){
	var datepicker = $('.datepicker');
	datepicker.datepicker({
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

	var newDate = new Date();
	var day = newDate.getDate();
	var month = newDate.getMonth() + 1;
	var year = newDate.getFullYear();

	var dateString = ( day < 10 ? '0'+day : day ) + '.' + ( month < 10 ? '0'+month : month ) + '.' + year;
	datepicker.datepicker('setDate', dateString);

});
