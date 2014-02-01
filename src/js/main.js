jsonEditor = function() {
	var $addForm = $('.js-addForm'),
		$addSelect = $('.js-selectType'),
		$addInput = $('.js-columnName'),
		$table = $('.js-editorTable'),
		$tableHead = $table.find('thead>tr'),
		$tableBody = $table.children('tbody'),
		$getOutput = $('.js-getOutput'),
		$output = $('.js-output'),
		types = {
			string: {
				$template: $('<input class="form-control table-input js-input" type="string"/>'),
				build: function($element, name){
					$element.attr('placeholder', name);
					$element.attr('data-name', name);
					$element.attr('data-type', 'string');
				},
				getValue: function($element){
					return $element.val();
				}
			},
			textarea: {
				$template: $('<textarea class="form-control js-input"/>'),
				build: function($element, name){
					$element.attr('placeholder', name);
					$element.attr('data-name', name);
					$element.attr('data-type', 'textarea');
				},
				getValue: function($element){
					return $element.val();
				}
			},
			bool: {
				$template: $(
					'<div class="js-input">'+
						'<label class="radio-inline">'+
							'<input name="" checked class="js-true" type="radio" value="1"> true'+
						'</label>'+
						'<label class="radio-inline">'+
							'<input name="" type="radio" value="0"> false'+
						'</label>'+
					'</div>'),
				build: function($element, name, number){
					$element.attr('data-name', name);
					$element.find('input').attr("name", "column-" + name + '-'+number);
					$element.attr('data-type', 'bool');
				},
				getValue: function($element){
					return $element.find('.js-true').prop('checked');
				}
			},
			number: {
				$template: $('<input type="number" class="form-control table-input js-input"/>'),
				build: function($element, name){
					$element.attr('data-name', name);
					$element.attr('data-type', 'number');
				},
				getValue: function($element){
					return parseFloat($element.val(), 10);
				}
			}
		},
		templates = {
			$th: $('<th class="m-heading m-input"><span class="name"/><small class="glyphicon glyphicon-remove pull-right js-remove"/></th>'),
			$td: $('<td class="m-input"/>'),
			$number: $('<td class="m-number"/>')
		},
		dataObject = {},
		isEmptyRow = false;
	var addColumn = function(type, name){
		var $th = templates.$th.clone(),
			$td = templates.$td.clone(),
			$input = types[type].$template.clone();
		$th.attr('data-name', name).find('.name').text(name);
		$tableHead.append($th);
		$tr = $tableBody.find('tr');
		for (var i = 0; i < $tr.length; i++) {
			types[type].build($input, name, i);
			$td.attr('data-name', name).html('').append($input.clone());
			$tr.eq(i).append($td.clone());
		}
	};
	var removeColumn = function(name){
		$tableHead.find('th[data-name='+name+']').remove();
		$tableBody.find('td[data-name='+name+']').remove();
	};
	var addRow = function(){
		var $newRow = $tableBody.find('tr').last().clone(),
			$number = $newRow.find('.m-number');
		$newRow.find('input.js-input').val('');
		$number.text(parseInt($number.text(), 10) + 1);
		$newRow.find('input[type=radio]').each(function(){
			var name = this.getAttribute('name');
			name = name.replace(/\d+/, $number.text());
			this.setAttribute('name', name);
		});
		$newRow.appendTo($tableBody);
	};
	var checkInput = function(){
		return true;
	};
	var showError = function(){};
	var generateJson = function(){
		var output = [];
		$tableBody.children('tr').each(function(){
			var object = {};
			$(this).find('.js-input').each(function(){
				if (types[this.getAttribute('data-type')].getValue($(this))){
					object[this.getAttribute('data-name')] = types[this.getAttribute('data-type')].getValue($(this));
				}
			});
			if (Object.getOwnPropertyNames(object).length > 0){
				output.push(object);
			}
		});
		$output.val(JSON.stringify(output));

	};
	$addForm.on('submit', function(e){
		e.preventDefault();
		var checkResult = checkInput();
		if (!checkResult.error){
			addColumn($addSelect.val(), $addInput.val());
		} else {
			showError(checkResult.errorText);
		}
		return false;
	});
	$table.on('click', '.js-remove', function(){
		removeColumn($(this).parent().attr('data-name'));
	});
	$table.on('focus', 'tr:last-child .js-input', function(){
		if (!isEmptyRow){
			addRow();
		}
	});
	$getOutput.on('click', generateJson);
};
jQuery(document).ready(function($) {
	jsonEditor();
});