$(function() {
	$("#header").load("./header.html"); 
	$("#footer").load("./footer.html"); 
	pagina = 0;

	vincularEventos();
	inicializarSelectsAno(['#ano_modelo', '#ano_fabricacao'], 2019, 2000);
	inicializarSelectsAno(['#filtro_ano_modelo', '#filtro_ano_fabricacao'], 2019, 2000, true);
	inicializarSelectsMarca(['#marca', '#filtro_marca']);
	// $('#placa').inputmask({mask: 'AAA-9999'});
	
	var idAutomovel = obterIdUrl();
	if (idAutomovel != false) {
		editarAutomovel(idAutomovel);
		$('#salvar').val('Editar');
		$('#coluna_acoes_lista, #incluir_pedido').hide();
	} else {
		$('#box').show(); 
		listar();
	}
	$(document).ready(function() {
		$('#data').mask('00/00/0000');
		$('#preco').mask("#.##0,00", {reverse: true});
		$('#preco_fipe').mask("#.##0,00", {reverse: true});
		$('#placa').mask('AAA-0000');
	});
});

function vincularEventos() {
	console.log('asdasdasd');
	$('#incluir_pedido').on('click', function() {
		$('#box_incluir').each(function() {
			this.reset();
		});
		$('#box').hide();
		$('#box_incluir').show();
		$('#coluna_acoes_lista, #incluir_pedido').hide();
		$('#salvar').val('Salvar');
	});

	$('.cancelar').on('click', function() {
		$('#box').show();
		$('#box_incluir').hide();
		$('#coluna_acoes_lista').show();
		$('#incluir_pedido').show();
		listar();
		window.location.hash = '';
	});

	$('#excluir').on('click', function() {
		if (confirm('Deseja realmente excluir?')) {
			var listaExcluir =  '';

			$('#tabela_automoveis tbody input:checkbox:checked').each(function() {
				listaExcluir = ($(this).parents('tr').attr('data-id'));
			});

			if (!listaExcluir.length) {
				alert('Selecione algum veículo para exclusão');
			} else {
				$.ajax({
					type: 'DELETE',
					headers:{    
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*' ,
						'Accept' : "application/json",
						'Content-Type': "application/json"
					},
					url: 'https://apirestdev.herokuapp.com/api/carro/' + listaExcluir,	
					'complete': function() {
						setTimeout(function() {$('#box_excluir').fadeIn();}, 1000);
						setTimeout(function() {$('#box_excluir').fadeOut();}, 3000);
						listar();
					}
				});
			}
		}
	});

	$('#sair').on('click', function() {
		window.localStorage.removeItem('usuario');
		window.location.href = "http://localhost/Login_v2/index.html"
	});

	$('#despesas').on('click', function() {
		window.location.href = "http://localhost/Login_v2/views/despesa.html"
	});



	$('#salvar').on('click', function() {
		var camposObrigatorios = ['#descricao', '#placa'];
		var idAutomovel = obterIdUrl();
		$(camposObrigatorios.join(', ')).parent().removeClass('warning');

		if ($('#descricao').val().trim() != '' && $('#placa').val() != '' && $('#placa').val().indexOf('_') == -1) {
			var listaAcessorios = [];
			
			$('input:checkbox:checked').each(function() {
				listaAcessorios.push($(this).val());
			});
			var json = {
				"descricao": $("#descricao").val(),
				"placa": $("#placa").val(),
				"renavam": $("#renavam").val(),
				"anoModelo": $("#ano_modelo").val(),
				"anoFabricacao": $("#ano_fabricacao").val(),
				"cor": $("#cor").val(),
				"km": $("#km").val(),
				"marca": $("#marca").val(),
				"preco": parseFloat($("#preco").val()),
				"preco_fipe": parseFloat($("#preco_fipe").val()),
				"idUser": window.localStorage.getItem('usuario')
			}
			if (idAutomovel) {
				$.ajax({
					type: 'PUT',
					headers:{    
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*' ,
						'Accept' : "application/json",
						'Content-Type': "application/json"
					},
					url: 'https://apirestdev.herokuapp.com/api/carro/' + idAutomovel,		
					dataType: 'json',	
					'data': JSON.stringify(json),
					'complete': function(resp) {
						console.log(resp);
						$('#box').show(),
						$('#box_incluir').hide(),
						$('#coluna_acoes_lista').show(),
						$('#incluir_pedido').show(),
						setTimeout(function() {$('#box_sucesso').fadeIn();}, 1000);
						setTimeout(function() {$('#box_sucesso').fadeOut();}, 3000);
						listar();
						window.location.hash = '';
					}
				});
			} else {
				$.ajax({
					type: 'POST',
					headers:{    
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*' ,
						'Accept' : "application/json",
						'Content-Type': "application/json"
					},
					url: 'https://apirestdev.herokuapp.com/api/carro/',		
					dataType: 'json',	
					'data': JSON.stringify(json),
					'complete': function(resp) {
						$('#box').show(),
						$('#box_incluir').hide(),
						$('#coluna_acoes_lista').show(),
						$('#incluir_pedido').show(),
						setTimeout(function() {$('#box_sucesso').fadeIn();}, 1000);
						setTimeout(function() {$('#box_sucesso').fadeOut();}, 3000);
						listar();
					}
				});
			}
		} else {
			$.each(camposObrigatorios, function(i, seletor) {
				if ($(seletor).val().trim() == '') {
					$(seletor).parent().addClass('warning');
				}

				if (seletor == '#placa') {
					if ($('#placa').val().indexOf('_') > -1) {
						$(seletor).parent().addClass('warning');
					}
				}
			});
			alert('Preencha os campos obrigatórios.');
		}
	});

	$('#filtro').on('click', function() {
		$('#filtro_caixa').slideToggle(150);
	});

	$('#tabela_automoveis th input[type="checkbox"]').on('click', function() {
		var _this = $(this);

		$.each($('#tabela_automoveis tbody input[type="checkbox"]'), function() {
			$(this).prop('checked', _this.is(':checked'));
		});
	});

	$(document).on('click', '#tabela_automoveis tbody tr td:not(:first-child)', function() {
		var idAutomovel = $(this).parent().attr('data-id');
		window.location.hash = idAutomovel; 
		$('#coluna_acoes_lista, #incluir_pedido').hide();
		editarAutomovel(idAutomovel);
		obterDadosAutomovel(idAutomovel);
		$('#salvar').val('Editar');
	});

	$('#btn_pesquisar').on('click', function() {
		listar();
	});

	$('#proximo').on('click', function() {
		// if (pagina != ultimaPagina) {
		// 	pagina++;
		// 	listar();
		// }


		return false;
	});

	$('#anterior').on('click', function() {
		if (pagina >= 1) {
			pagina--;
			listar();
		}

		return false;
	});
}

function inicializarSelectsAno(selectors, anoInicio, anoFim, selecione) {
	selecione = selecione || false;

	if (selecione) {
		$(selectors.join(', ')).append(
			$('<option>', {'text': 'Selecione'})
		);
	}

	for (var i = anoInicio; i >= anoFim; i--) {
		$(selectors.join(', ')).append(
			$('<option>', {'value': i, 'text': i})
		);
	}
}

function inicializarSelectsMarca(selectors) {
	$(selectors.join(', ')).append(
		$('<option>', {'value': '', 'text': 'Selecione'}),
		$('<option>', {'value': 'Alfa Romeu', 'text': 'Alfa Romeu'}),
		$('<option>', {'value': 'Audi', 'text': 'Audi'}),
		$('<option>', {'value': 'Bmw', 'text': 'BMW'}),
		$('<option>', {'value': 'Fiat', 'text': 'Fiat' }),
		$('<option>', {'value': 'Ford', 'text': 'Ford' }),
		$('<option>', {'value': 'Honda', 'text': 'Honda' }),
		$('<option>', {'value': 'Hyundai', 'text': 'Hyundai' }),
		$('<option>', {'value': 'Jeep', 'text': 'Jeep' }),
		$('<option>', {'value': 'Renault', 'text': 'Renault' }),
		$('<option>', {'value': 'Toyota', 'text': 'Toyota' }),
		$('<option>', {'value': 'Susuki', 'text': 'Susuki' }),
		$('<option>', {'value': 'Toyota', 'text': 'Toyota' }),
		$('<option>', {'value': 'Volkswagen', 'text': 'Volkswagen' }),
	)
}

function listar() {
	$.ajax({
		type: 'GET',
		headers:{    
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*' 
		},
		url: 'https://apirestdev.herokuapp.com/api/carros/' + window.localStorage.getItem('usuario'),		
		dataType: 'json',		
		'success': function(resp) {
			console.log(resp);
			// ultimaPagina = Math.ceil(dados['totalRegistros'] / dados['paginacao']) - 1;
			mostrarDadosTabela(resp);
		}
	});
}

function mostrarDadosTabela(automoveis) {
	$('#tabela_automoveis tbody').empty();
	
	$.each(automoveis, function(key, automovel) {
		$('#tabela_automoveis tbody').append(
			$('<tr>', {'data-id': automovel.id}).append(
				$('<td>').append(
					$('<input>', {'type': 'checkbox'})
				),
				$('<td>', {'text': automovel.descricao}),
				$('<td>', {'text': automovel.placa}),
				$('<td>', {'text': automovel.marca})
			)
		);                        
	});
};

function obterIdUrl() {
	res = 0;

	var id_pagina = window.location.href.split('#');

	if (typeof id_pagina[1] != 'undefined' && id_pagina[1] != '') {
		res = parseInt(id_pagina[1]);
	}

	return res;
}

function editarAutomovel(id) {
	$('#box').hide();
	$('#box_incluir').show();
}

function obterDadosAutomovel(idAutomovel) {
	$.ajax({
		type: 'GET',
		headers:{    
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*' 
		},
		url: 'https://apirestdev.herokuapp.com/api/carro/' + idAutomovel,
		success: function(automovel) {
			$('#descricao').val(automovel.descricao);
			$('#placa').val(automovel.placa);
			$('#renavam').val(automovel.renavam);
			$('#ano_modelo').val(automovel.anoModelo);
			$('#ano_fabricacao').val(automovel.anoFabricacao); //camelcase
			$('#cor').val(automovel.cor);
			$('#km').val(automovel.km);
			$('#marca').val(automovel.marca);
			$('#preco').val(automovel.preco.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}));
			$('#preco_fipe').val(automovel.preco_fipe.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}));
		}
	});
}