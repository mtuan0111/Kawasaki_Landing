(function ($) {


  /* ------------------------------- */
  $(function(){
    load_event();
	transparent_load_event();
    /*slidescroll*/
    $("a[href*='#']").slideScroll();
  });

})(jQuery);

/*image rollover*/
var load_event = function(){
  $('a>img[src*="-out-"],input[src*="-out-"]').each(function(){
    var $$ = $(this);
    $$.mouseover(function(){ $(this).attr('src', $(this).attr('src').replace(/-out-/,'-on-')) });
    $$.mouseout (function(){
      if ( $(this).attr('wws') != 'current' ) { $(this).attr('src', $(this).attr('src').replace(/-on-/,'-out-')) }
    });
  });

  //$('a[subwin]').die('click').click(subwin_func);

}

/*sub window*/
var subwin_func = function () {
  var $$ = $(this);
  var param = $$.attr('subwin').split(/\D+/);
  var w = param[0] || 300;
  var h = param[1] || 300;
  var s = ($$.attr('subwin').match(/slim/))?'no':'yes';
  var r = ($$.attr('subwin').match(/fix/) )?'no':'yes';
  var t = $$.attr('target') || '_blank' ;
  window.open( $$.attr('href'), t, "resizable="+r+",scrollbars="+s+",width="+w+",height="+h ).focus();
  return false;
}

/* transparent */
var transparent_load_event = function(){
	var timer = setTimeout(function(){
		$('a img.transparent').each(function(){
			var $$ = $(this);
			$$.bind("mouseover", function(){
				$(this).stop().queue([]).fadeTo(300, 0.7);
			})
			$$.bind("mouseout", function(){
				$(this).stop().queue([]).fadeTo(300, 1);
			})
		});
	}, 600)
}