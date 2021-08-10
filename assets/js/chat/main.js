$(".register-btn").on('click', function(e){
		jQuery(".ct-loading-main-complete_booking").show();
		e.preventDefault();

		var btnHTML = $(this).html();
		// $(this).html("<img id='loader' src='images/loader.svg' alt='Loading...!' />");

		$.ajax({
			url : './process.php',
			method : 'POST',
			data : $("#register-form").serialize(),
			success : function(response){
				jQuery(".ct-loading-main-complete_booking").hide();
				$("#register-btn").html(btnHTML);
				console.log(response.message);
				$("#register-form").trigger("reset");
				changeForm($(".login-register-btn"));
			},
			error : function(er){
				console.log(er);
			}

		});

	});

	$(document).on('click', '.login-btn', function(){
	    
		jQuery(".ct-loading-main").show();
		console.log("chat login");
		var btnHTML = $(this).html();
		// $(this).html("<img id='loader' src='images/loader.svg' alt='Loading...!' />");
		var form_data = $("#login-form").serialize();
		var autologin = $(this).attr("data-autologin-id");
		var url_data = './process.php';
		var redirect_url = './chat.php';

		if(form_data == "" && autologin == 1){
			form_data = {login_user : 1,password: '',autologin : 1};
			url_data = '../process.php';
			redirect_url = '../chat.php';
		}
		if(form_data == "" && autologin == 2){
			form_data = {login_user : 1,password: '',autologin : 2};	
		}

		$.ajax({
			url : url_data,
			method : 'POST',
			data : form_data,
			success : function(resp){

				
				var response = JSON.parse(resp);

				console.log(response);

				if (response.status == 200) {
					var token = response.message.token;
					firebase.auth().signInWithCustomToken(token).catch(function(error) {
					  // Handle Errors here.
					  var errorCode = error.code;
					  var errorMessage = error.message;
					  
					  //alert(errorMessage);

					}).then(function(data){
						jQuery(".ct-loading-main").hide();
						$("#login-btn").html(btnHTML);
						// alert(autologin);
						if (data.user.uid != "" && autologin != 2) {
							window.location.href = redirect_url;
						}
					});
				}else{
					//alert(response.message);
				}
                jQuery(".ct-loading-main").hide();
			}
		})
	});

		
	

	$(".login-register-btn").on('click', function(){

		changeForm(this)


	});


	function changeForm($this){
		$($this).children("span").toggleClass("active")

		$(".content").toggleClass('active');
	}

	$(".card input").on('focus blur', function(){

		$(".card").toggleClass("active");

	});