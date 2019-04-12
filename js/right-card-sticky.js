$(function() {
  //Липкая позиция
  var isStickyPositionScroll = true;
  function stickyPosition() {
    var windowWidth = $(window).width();
    isStickyPositionScroll = windowWidth >= 767;
  }
  var orderingInfo = $('.right-card');
  var orderingPosition = orderingInfo.offset().top;
  $(window).on('scroll', function () {
    if(isStickyPositionScroll) {
      var scrollTop = $(this).scrollTop();
      if (scrollTop >= orderingPosition) {
        if( !orderingInfo.hasClass('fixed') ) {
          orderingInfo.addClass('fixed');
        }
      } else {
        orderingInfo.removeClass('fixed');
      }
    }
  });

  stickyPosition();
  $(window).on('resize', function() {
    stickyPosition();
  });
});
