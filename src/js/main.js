(function(){
Notification = function(){
	$errorHolder = $('.js-errorHolder');
	this.showMessage = function(errorText, className){
		$errorHolder.
			addClass(className).
			text(errorText).
			removeClass('m-hidden');
	};
	this.hideMessage = function(className){
		$errorHolder.
			addClass('m-hidden').
			removeClass(className);
	};
};
columnTypes = {
	string: {
		$template: $('<input data-type="string" class="form-control table-input js-input" type="string"/>'),
		build: function($element, name){
			$element.attr('placeholder', name);
			$element.attr('data-name', name);
		},
		getValue: function($element){
			return $element.val();
		}
	},
	textarea: {
		$template: $('<textarea data-type="textarea" class="form-control js-input"/>'),
		build: function($element, name){
			$element.attr('placeholder', name);
			$element.attr('data-name', name);
		},
		getValue: function($element){
			return $element.val();
		}
	},
	bool: {
		$template: $(
			'<div class="js-input" data-type="bool">'+
				'<label class="radio-inline">'+
					'<input name="" class="js-true" type="radio" value="1"> true'+
				'</label>'+
				'<label class="radio-inline">'+
					'<input name="" type="radio" value="0"> false'+
				'</label>'+
			'</div>'),
		build: function($element, name, number){
			$element.attr('data-name', name);
			$element.find('input').attr("name", "column-" + name + '-'+number);
		},
		getValue: function($element){
			return $element.find('.js-true').prop('checked');
		}
	},
	number: {
		$template: $('<input data-type="number" type="number" class="form-control table-input js-input"/>'),
		build: function($element, name){
			$element.attr('data-name', name);
		},
		getValue: function($element){
			return parseFloat($element.val(), 10);
		}
	}
};
jsonEditor = function() {
	var $addForm = $('.js-addForm'),
		$addSelect = $('.js-selectType'),
		$addInput = $('.js-columnName'),
		$table = $('.js-editorTable'),
		$tableHead = $table.find('thead>tr'),
		$tableBody = $table.children('tbody'),
		$getOutput = $('.js-getOutput'),
		$output = $('.js-output'),
		msg = new Notification(),
		types = columnTypes,
		templates = {
			$th: $('<th class="m-heading m-input"><span class="name"/><small class="glyphicon glyphicon-remove pull-right js-remove"/></th>'),
			$td: $('<td class="m-input"/>'),
			$number: $('<td class="m-number"/>')
		},
		dataObject = {},
		timeoutObject = 0,
		options = {},
		$optionsHolder = $('.js-optionsHolder');
	var addColumn = function(type, name){
		var $th = templates.$th.clone(),
			$td = templates.$td.clone(),
			$input = types[type].$template.clone();
		$th.attr('data-name', name).addClass('m-type-'+type).find('.name').text(name);
		$tableHead.append($th);
		$tr = $tableBody.find('tr');
		for (var i = 0; i < $tr.length; i++) {
			types[type].build($input, name, i);
			$td.attr('data-name', name).html('').append($input.clone());
			$tr.eq(i).append($td.clone());
		}
		msg.showMessage('Column added', 'btn-success');
		clearTimeout(timeoutObject);
		timeoutObject = setTimeout(function(){
			msg.hideMessage('btn-success');
		}, 500);
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
		if ($addSelect.val() === null){
			$addSelect.parent().addClass('has-error');
			msg.showMessage('Error: no column type', 'btn-danger');
			return false;
		} else {
			$addSelect.parent().removeClass('has-error');
		}
		if ($addInput.val() === ''){
			$addInput.parent().addClass('has-error');
			msg.showMessage('Error: no column name', 'btn-danger');
			return false;
		} else {
			$addInput.parent().removeClass('has-error');
		}
		msg.hideMessage('btn-danger');
		return true;
	};
	var generateJson = function(){
		var output = [];
		$tableBody.children('tr').each(function(){
			var object = {};
			$(this).find('.js-input').each(function(){
				var value = types[this.getAttribute('data-type')].getValue($(this)),
					keepEmpty = options.keepEmpty || (value || value === false || value === 0);
				if (keepEmpty){
					object[this.getAttribute('data-name')] = types[this.getAttribute('data-type')].getValue($(this));
				}
			});
			if (Object.getOwnPropertyNames(object).length > 0){
				output.push(object);
			}
		});
		return output;

	};
	$addForm.on('submit', function(e){
		e.preventDefault();
		if (checkInput()){
			addColumn($addSelect.val(), $addInput.val());
		}
		return false;
	});
	$table.on('click', '.js-remove', function(){
		removeColumn($(this).parent().attr('data-name'));
	});
	$table.on('keyup change', 'tr:last-child .js-input', function(){
		if (this.value.length > 0){
			addRow();
		}
	});
	$optionsHolder.on('change', '.js-optionTrigger', function(){
		options[this.name] = this.checked;
	});
	$getOutput.on('click', function(){
		if (options.formatted){
			$output.val(JSON.stringify(generateJson(), null, 2));
		} else {
			$output.val(JSON.stringify(generateJson()));
		}
	});
};
jQuery(document).ready(function($) {
	jsonEditor();
});
})();