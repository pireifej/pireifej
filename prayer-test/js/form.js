(
    function($){
	"use strict";
	$('.input100').each(function(){
	    $(this).on('blur',function(){
		if($(this).val().trim()!=""){
		    $(this).addClass('has-val');
		}
		else{
		    $(this).removeClass('has-val');
		}
	    })
	})
	
	var subject=$('.validate-input input[name="subject"]');
	var message=$('.validate-input textarea[name="message"]');
	$('.validate-form').on('submit',function(){
	    var check=true;
	    if($(subject).val().trim()==''){
		showValidate(subject);
		check=false;
	    }
	    if($(message).val().trim()==''){
		showValidate(message);
		check=false;
	    }
	    return check;
	});
	$('.validate-form .input100').each(function(){
	    $(this).focus(function(){
		hideValidate(this);
	    });
	});
	function showValidate(input){
	    var thisAlert=$(input).parent();
	    $(thisAlert).addClass('alert-validate');
	}
	function hideValidate(input){
	    var thisAlert=$(input).parent();
	    $(thisAlert).removeClass('alert-validate');
	}})(jQuery);
