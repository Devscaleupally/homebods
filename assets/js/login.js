jQuery(document).ready(function () {    

jQuery("#show-pass").click(function () {

	if (jQuery(".showpassword").attr("type")=="password") {            

	jQuery(".showpassword").attr("type", "text");        

	}else{            

	jQuery(".showpassword").attr("type", "password");        

	}    

});    

	jQuery('.login-error').hide();    

jQuery('#show-pass').click(function(){        

	if(jQuery("#show-pass").is(":checked")) {            

	jQuery('.icon-lock').addClass('icon-unlock');            

	jQuery('.icon-unlock').removeClass('icon-lock');        

	} else {            

	jQuery('.icon-unlock').addClass('icon-lock');            

	jQuery('.icon-lock').removeClass('icon-unlock');        

	}    

});    

jQuery('#ct_forget_password').click(function(){        

	jQuery('.ct-main-login').addClass('hide-data');        

	jQuery('.login-error').hide();        

	jQuery('.forgotpassword-error').hide();        

	jQuery('.forget_pass_incorrect').text("");        

	jQuery('.forget_pass_correct').text("");        

	jQuery('.ct-main-forget-password').removeClass('hide-data');        

	jQuery('.ct-main-forget-password').addClass('show-data');    

});    

jQuery('#ct_login_user').click(function(){        

	jQuery('.login-error').hide();        

	jQuery('.forgotpassword-error').hide();        

	jQuery('.forget_pass_incorrect').text("");        

	jQuery('.forget_pass_correct').text("");        

	jQuery('.ct-main-forget-password').removeClass('show-data');       

	jQuery('.ct-main-forget-password').addClass('hide-data');        

	jQuery('.ct-main-login').addClass('show-data');        

	jQuery('.ct-main-login').removeClass('hide-data');    

});      

/* login check */    

jQuery(document).on('click','.mybtnloginadmin',function(){        

	var name = jQuery('#userEmail').val();        

	var password = jQuery('#userPassword').val();        

	var remember;        

	if(jQuery('#remember_me').prop("checked")){            

		remember = true;

	}else{

		remember = false;

	}        

	jQuery('.login-error').hide();        

	jQuery.ajax({            

		type : 'post',            

		data : {                

			name : name,                

			password : password,                

			remember : remember,                

			checkadmin : 1            

		},            

		url : ajax_url+"admin_login_ajax.php",            

		success : function(res){     
			
			if(res.trim() == "yesuser"){

				window.location.replace(base_url+"/admin/my-appointments.php");                

			}else if(res.trim() == "yesadmin"){                    

				window.location.replace(base_url+"/admin/calendar.php");                

			}else if(res.trim() == "yesstaff"){

				window.location.replace(base_url+"/staff/staff-dashboard.php");				

			}else{                    

				jQuery('.login-error').show();                

			}            
			
		}        

	});    

});    

	

	/*Reset Password*/    

jQuery(document).on('click','#reset_pass',function(){

	var email=jQuery('#rp_user_email').val();

	var dataString={email:email,action:"forget_password"};        

	if(jQuery('#forget_pass').valid()){

		jQuery.ajax({                

		type:"POST",                

		url:ajax_url+"admin_login_ajax.php",                

		data:dataString,                

		success:function(response){                    

		if(response=='not'){						

		jQuery('.forget_pass_correct').hide();                        

		jQuery('.forget_pass_incorrect').css('display','block');                        

		jQuery('.forget_pass_incorrect').css('color','red');						

		jQuery('.forget_pass_incorrect').html(errorobj_invalid_email_id_please_register_first);                    

		}                    

		else{						

		jQuery('.forget_pass_incorrect').hide();                        

		jQuery('.forget_pass_correct').css('display','block');                        

		jQuery('.forget_pass_correct').css('color','green');                        

		jQuery('.forget_pass_correct').html(errorobj_your_password_send_successfully_at_your_email_id);																								jQuery('#reset_pass').css({"pointer-events": "none", "cursor": "default"});						jQuery('#reset_pass').unbind('click');						setTimeout(function() { window.location.href = base_url;  },5000);						event.preventDefault();		                    }                }            });        }    });    /* validation for reset_password.php */    jQuery(document).ready(function(e)  {        jQuery('#forget_pass').submit(function(event){            event.preventDefault();            event.stopImmediatePropagation();        });        jQuery("#forget_pass").validate({            rules: {                rp_user_email: {                    required: true,                    email: true                }            },            messages:{                rp_user_email: {                    required : errorobj_please_enter_email_address,                    email : errorobj_please_enter_valid_email_address                }            }        });    });    /* validation for reset_new_password.php */    jQuery(document).ready(function()  {        jQuery('#reset_new_passwd').submit(function(event){            event.preventDefault();            event.stopImmediatePropagation();        });        jQuery.validator.addMethod("noSpace", function(value, element) {            return value.indexOf(" ") < 0 && value != "";        }, "No space allowed");        jQuery("#reset_new_passwd").validate({            rules: {                n_password: {                    required: true,                    minlength: 8,                    maxlength: 20,                    noSpace: true                },                rn_password: {                    required: true,                    minlength: 8,                    maxlength: 20,                    noSpace: true                }            },            messages:{                n_password: {                    required : errorobj_please_enter_new_password,                    minlength: errorobj_password_at_least_have_8_characters,                    maxlength: "Password Must Be Only 20 Characters"                },                rn_password: {                    required: errorobj_please_enter_retype_new_password,                    minlength: errorobj_password_at_least_have_8_characters,                    maxlength: "Password Must Be Only 20 Characters"                }            }        });    });    jQuery(document).on('click','#rn_password',function(){        jQuery('.mismatch_password').hide();    });    jQuery(document).on('click','#n_password',function(){        jQuery('.mismatch_password').hide();    });    jQuery(document).on('click','#password',function(){        jQuery('.succ_password').hide();    });    jQuery(document).on('click','#email',function(){        jQuery('.succ_password').hide();    });    /*Reset New Password*/    jQuery(document).on('click','#reset_new_password',function(){        var new_reset_pass=jQuery('#n_password').val();        var retype_new_reset_pass=jQuery('#rn_password').val();        var dataString={retype_new_reset_pass:retype_new_reset_pass,action:"reset_new_password"};        if(jQuery('#reset_new_passwd').valid()){            if(new_reset_pass == retype_new_reset_pass){                jQuery.ajax({                    type:"POST",                    url:ajax_url+"admin_login_ajax.php",                    data:dataString,                    success:function(response){                        if(response==1){                            jQuery('.succ_password').css('display','block');                            jQuery('.succ_password').addClass('txt-success');                            jQuery('.succ_password').html(errorobj_your_password_reset_successfully_please_login);                            window.location = base_url+"/admin";                        }                    }                });            }else{                jQuery('.mismatch_password').css('display','block');                jQuery('.mismatch_password').addClass('error');                jQuery('.mismatch_password').html(errorobj_new_password_and_retype_new_password_mismatch);            }        }    });     /*  INSERT Staff */    jQuery(document).on("click", "#ct_staff_register", function () {        var fullname=jQuery("#staff_name").val();        var email=jQuery("#staff_email").val();        var pass=jQuery("#staff_pass").val();        var service_ids=jQuery("#get_service_data").val();     /* var filename = image.replace(/^.*\\/, ""); */      if (!jQuery("#staff_registration").valid()) { return false; }      if(jQuery("#staff_registration").valid()){      jQuery.ajax({        type: "post",        data: { "fullname":fullname,"email":email,"pass":pass,"service_ids":service_ids,action:"staff_reg" },        url: ajax_url + "admin_login_ajax.php",        success: function (res) {          jQuery(".ct-loading-main").hide();          jQuery("#register-meesg").css('display','block');           setTimeout(function() {								location.reload();						}, 5000);          }        });         }        });    /*validation  for staff insert form*/      jQuery(document).ready(function(){        jQuery("#staff_registration").validate({          rules: {            staff_email:{              required: true,              email:true,              remote: {                url:ajax_url+"admin_login_ajax.php",                type: "POST",                data:  { email: function(){ return jQuery("#staff_email").val(); }, },              }            },            staff_name: {              required:true,            },            staff_pass: {              required:true,              minlength: 8,              maxlength: 15            },          },          messages: {            staff_email:{            required:errorobj_please_enter_email,email:errorobj_please_enter_valid_email_address,remote:errorobj_email_already_exists             },            staff_name: {            required: errorobj_please_enter_name,            },            staff_pass: {            required: errorobj_please_enter_password,            min: errorobj_please_enter_minimum_8_characters,            max: errorobj_please_enter_maximum_15_characters,            },          }        });      });});

