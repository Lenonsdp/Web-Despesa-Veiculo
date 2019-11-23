
(function ($) {
	"use strict";


	/*==================================================================
	[ Focus input ]*/
	$('.input100').each(function(){
		$(this).on('blur', function(){
			if($(this).val().trim() != "") {
				$(this).addClass('has-val');
			}
			else {
				$(this).removeClass('has-val');
			}
		})    
	})
	  
	var input = $('.validate-input .logins');
	$('#buttonLogin').on('click',function(){
		var check = true;

		for(var i=0; i<input.length; i++) {
			if(validate(input[i]) == false){
				showValidate(input[i]);
				check=false;
			}
		}

		if (check) {
			$.ajax({
				type: 'GET',
				headers:{    
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*' 
				},
				url: 'https://apirestdev.herokuapp.com/api/user/'+$('#email').val()+'/'+$('#senha').val(),		
				dataType: 'json',
				success: function (data) {
					if (data) {
						window.location.href = 'http://localhost/Login_v2/views/home.html';
					} else {
						alert('Usuário ou senha inválidos.');
					}
				}
			});
		} else {
			return check;
		}
	});

	var inputCadastro = $('.validate-input .loginsCadastro');
	$('#buttonLoginCadastro').on('click',function(){
		var checkCadastro = true;

		for(var i=0; i<inputCadastro.length; i++) {
			if(validateCadastro(inputCadastro[i]) == false){
				showValidate(inputCadastro[i]);
				checkCadastro=false;
			}
		}

		if (checkCadastro) {
			if ($('#senhaCadastro').val() != $('#senhaCadastroRepeat').val()) {
				alert('Senhas não conferem');
			} else {
				var json = {
					"email": $("#emailCadastro").val(),
					"senha": $("#senhaCadastro").val()
				}
				$.ajax({
						type: 'POST',
						headers:{    
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*' ,
							'Accept' : "application/json",
							'Content-Type': "application/json"
						},
						url: 'https://apirestdev.herokuapp.com/api/user/',		
						dataType: 'json',	
						'data': JSON.stringify(json),
						'complete': function(resp) {							
							setTimeout(function() {$('#box_sucesso').fadeIn();}, 1000),
							setTimeout(function() {
								$('#box_sucesso').fadeOut();
								$('#initLogin').show();
								$('#initCadastro').hide();
							}, 3000)						
						}, 
						error: function(resp) {
							setTimeout(function() {$('#box_erro').fadeIn();}, 1000),
							setTimeout(function() {$('#box_erro').fadeOut();}, 3000)	
						}
					});				
			}
		} else {
			return checkCadastro;
		}
	});

	$('#senha').keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '13'){
			var check = true;

			for(var i=0; i<input.length; i++) {
				if(validate(input[i]) == false){
					showValidate(input[i]);
					check=false;
				}
			}

			if (check) {
				$.ajax({
					type: 'GET',
					headers:{    
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*' 
					},
					url: 'https://apirestdev.herokuapp.com/api/user/'+$('#email').val()+'/'+$('#senha').val(),		
					dataType: 'json',
					success: function (data) {
						if (data) {
							window.localStorage.setItem('usuario', data.id);
							window.location.href = 'http://localhost/Login_v2/views/home.html';
						} else {
							alert('Usuário ou senha inválidos.');
						}
					}
				});
			} else {
				return check;
			}
	    }
	});

	$('#email').on('change',function(){
		 $(this).focus(function(){
		   hideValidate(this);
		});
	});

	$('#senha').on('change',function(){ 
		$('.focus-input100').removeClass('alert-validate');
	});

	$('#emailCadastro').on('change',function(){
		 $(this).focus(function(){
		   hideValidate(this);
		});
	});

	$('#senhaCadastro').on('change',function(){ 
		$('.focus-input100').removeClass('alert-validate');
	});

	$('#cadastro').on('click',function(){ 
		$('#initLogin').hide();
		$('#initCadastro').show();
	});

	$('#voltar').on('click',function(){ 
		$('#initLogin').show();
		$('#initCadastro').hide();
	});

	function validate (input) {
		if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
			if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
				return false;
			}
		}
		else {
			if($(input).val().trim() == ''){
				return false;
			}
		}
	}

	function validateCadastro (input) {
		if($(input).attr('type') == 'emailCadastro' || $(input).attr('name') == 'emailCadastro') {
			if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
				return false;
			}
		}
		else {
			if($(input).val().trim() == ''){
				return false;
			}
		}
	}

	function showValidate(input) {
		var thisAlert = $(input).parent();

		$(thisAlert).addClass('alert-validate');
	}

	function hideValidate(input) {
		var thisAlert = $(input).parent();

		$(thisAlert).removeClass('alert-validate');
	}
	
	/*==================================================================
	[ Show pass ]*/
	var showPass = 0;
	$('.btn-show-pass').on('click', function(){
		if(showPass == 0) {
			$(this).next('input').attr('type','text');
			$(this).find('i').removeClass('zmdi-eye');
			$(this).find('i').addClass('zmdi-eye-off');
			showPass = 1;
		}
		else {
			$(this).next('input').attr('type','password');
			$(this).find('i').addClass('zmdi-eye');
			$(this).find('i').removeClass('zmdi-eye-off');
			showPass = 0;
		}
		
	});


})(jQuery);