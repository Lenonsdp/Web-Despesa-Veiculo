$(function() {
	$("#header").load("./header.html"); 
	$("#footer").load("./footer.html"); 

	vincularEventos();

	var idDespesa = obterIdUrl();	
	if (idDespesa != false) {
		editarDespesa(idDespesa);
		$('#salvar').val('Editar');
		$('#coluna_acoes_lista, #incluir_despesa').hide();
	} else {
		$('#box').show(); 
		listar();
	}
});

function vincularEventos() {
	$('#sair').on('click', function() {
		window.localStorage.removeItem('usuario');
		window.location.href = "http://localhost/Login_v2/index.html"
	});

	$('#veiculo_despesa').on('click', function() {
		if ($('#veiculo_despesa').val() != '') {
			listar();
		} else {
			$('#tabela_despesa tbody').empty();
		}
	});
	
	$( document ).ready(function() {
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
				$.each(resp, function(i, resp) {
					$('#veiculo_despesa').append($('<option>', { 
						value: resp.id,
						text : resp.descricao 
					}));
				});
			}
		});
	});

	$('#dataIni').on('change', function() {		
		if ($('#dataIni').val() != '' && $('#dataFim').val() != '' && $('#veiculo_despesa').val() ) {
			listar();
		}
	});

	$('#dataFim').on('change', function() {
		if ($('#dataIni').val() != '' && $('#dataFim').val() != '' && $('#veiculo_despesa').val() ) {
			listar();
		}
	});

	$('#incluir_despesa').on('click', function() {
		$('#box_incluirDespesa').each(function() {
			this.reset();
		});
		$('#salvar_despesa').val('Salvar');
		if ($('#veiculo_despesa').val() == '') {
			alert('Selecione um veiculo para lançar uma despesa');
		} else {
			$('#box').hide();
			$('#box_incluirDespesa').show();
			var d = new Date();
			var strDate = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
			$('#data').val(strDate);
		}
	});

	$('#salvar_despesa').on('click', function() {
		var camposObrigatorios = ['#valor', '#data'];
		var idDespesa = obterIdUrl();
		$(camposObrigatorios.join(', ')).parent().removeClass('warning');
		if ($('#valor').val().trim() != '' && $('#data').val() != '') {
			var valor = $("#valor").val();
			valor = valor.toString().replace('R$', '');
			var json = {
				"valor": parseFloat(valor),
				"data": formatDate($("#data").val()),
				"observacoes": $("#observacoes").val(),
				"tipo": $("#tipo").val(),
				"idCarro": parseInt($('#veiculo_despesa').val())
			}
			if (idDespesa) {
				$.ajax({
					type: 'PUT',
					headers:{    
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*' ,
						'Accept' : "application/json",
						'Content-Type': "application/json"
					},
					url: 'https://apirestdev.herokuapp.com/api/despesa/' + idDespesa,		
					dataType: 'json',	
					'data': JSON.stringify(json),
					'complete': function(resp) {
						$('#box').show(),
						$('#box_incluirDespesa').hide(),
						$('#coluna_acoes_lista').show(),
						$('#incluir_despesa').show(),
						// setTimeout(function() {$('#box_sucesso').fadeIn();}, 1000);
						// setTimeout(function() {$('#box_sucesso').fadeOut();}, 3000);
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
					url: 'https://apirestdev.herokuapp.com/api/despesa/',		
					dataType: 'json',	
					'data': JSON.stringify(json),
					'complete': function(resp) {
						$('#box').show(),
						$('#box_incluirDespesa').hide(),
						$('#coluna_acoes_lista').show(),
						// setTimeout(function() {$('#box_sucesso').fadeIn();}, 1000);
						// setTimeout(function() {$('#box_sucesso').fadeOut();}, 3000);
						listar();
					}
				});
			}
		} else {
			$.each(camposObrigatorios, function(i, seletor) {
				if ($(seletor).val().trim() == '') {
					$(seletor).parent().addClass('warning');
				}
			});
			alert('Preencha os campos obrigatórios.');
		}
	});

	$(document).on('click', '#tabela_despesa tbody tr td:not(:first-child)', function() {
		var idDespesa = $(this).parent().attr('data-id');
		window.location.hash = idDespesa; 
		$('#coluna_acoes_lista, #incluir_pedido').hide();
		editarDespesa(idDespesa);
		obterDadosDespesa(idDespesa);
		$('#salvar_despesa').val('Editar');
	});

	$('.cancelar').on('click', function() {
		$('#box').show();
		$('#box_incluirDespesa').hide();
		$('#coluna_acoes_lista').show();
		$('#incluir_despesa').show();
		listar();
		window.location.hash = '';
	});

	$('#excluir').on('click', function() {
		if (confirm('Deseja realmente excluir?')) {
			var listaExcluir =  '';

			$('#tabela_despesa tbody input:checkbox:checked').each(function() {
				listaExcluir = ($(this).parents('tr').attr('data-id'));
			});

			if (!listaExcluir.length) {
				alert('Selecione alguma despesa para exclusão');
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
					url: 'https://apirestdev.herokuapp.com/api/despesa/' + listaExcluir,	
					'complete': function() {
						// setTimeout(function() {$('#box_excluir').fadeIn();}, 1000);
						// setTimeout(function() {$('#box_excluir').fadeOut();}, 3000);
						listar();
					}
				});
			}
		}
	});
}

function listar() {
	var dataIni = formatDate($('#dataIni').val());
	var dataFim = formatDate($('#dataFim').val()); 		
	if (dataIni != '' && dataIni != '') {
		$.ajax({
			type: 'GET',
			headers:{    
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*' 
			},
			url: 'https://apirestdev.herokuapp.com/api/despesas/' + $('#veiculo_despesa').val() + '/' + dataIni  + '/' + dataFim,		
			dataType: 'json',		
			'success': function(resp) {				
				// ultimaPagina = Math.ceil(dados['totalRegistros'] / dados['paginacao']) - 1;
				mostrarDadosTabela(resp);
			}
		});
	} else {
		$.ajax({
			type: 'GET',
			headers:{    
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*' 
			},
			url: 'https://apirestdev.herokuapp.com/api/despesas/' + $('#veiculo_despesa').val(),		
			dataType: 'json',		
			'success': function(resp) {				
				// ultimaPagina = Math.ceil(dados['totalRegistros'] / dados['paginacao']) - 1;
				mostrarDadosTabela(resp);
			}
		});
	}
}

function editarDespesa(id) {
	$('#box').hide();
	$('#box_incluirDespesa').show();
}

function mostrarDadosTabela(despesas) {
	$('#tabela_despesa tbody').empty();
	var totalDespesa = 0;

	$.each(despesas, function(key, despesas) { 	
		totalDespesa += despesas.valor;				
		$('#tabela_despesa tbody').append(
			$('<tr>', {'data-id': despesas.id}).append(
				$('<td>').append(
					$('<input>', {'type': 'checkbox'})
				),
				$('<td>', {'text': formatDate(despesas.data, 'pt-br')}),
				$('<td>', {'text': despesas.tipo}),
				$('<td>', {'text': despesas.valor.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"})})
			)
		)                      
	});

	$('#tabela_despesa tbody').append(
		$('<tr>').append(
			$('<th>', {'text': 'Total'}),
			$('<th>'),
			$('<th>'),
			$('<th>', {'text': totalDespesa.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"})})
		)
	)
};

function obterIdUrl() {
	res = 0;

	var id_pagina = window.location.href.split('#');

	if (typeof id_pagina[1] != 'undefined' && id_pagina[1] != '') {
		res = parseInt(id_pagina[1]);
	}

	return res;
}

function obterDadosDespesa(idDespesa) {
	$.ajax({
		type: 'GET',
		headers:{    
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*' 
		},
		url: 'https://apirestdev.herokuapp.com/api/despesa/' + idDespesa,
		success: function(despesa) {
			$('#tipo').val(despesa.tipo);
			$('#observacoes').val(despesa.observacoes);
			$('#data').val(formatDate(despesa.data, 'pt-br'));
			$('#valor').val(despesa.valor.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}));
		}
	});
}

function formatDate(data, formato) {
  if (formato == 'pt-br') {
	return (data.substr(0, 10).split('-').reverse().join('/'));
  } else {
	return (data.substr(0, 10).split('/').reverse().join('-'));
  }
}
