jsonEditor=function(){var a=$(".js-addForm"),b=$(".js-selectType"),c=$(".js-columnName"),d=$(".js-editorTable"),e=d.find("thead>tr"),f=d.children("tbody"),g=$(".js-getOutput"),h=$(".js-output"),i={string:{$template:$('<input class="form-control table-input js-input" type="string"/>'),build:function(a,b){a.attr("placeholder",b),a.attr("data-name",b),a.attr("data-type","string")},getValue:function(a){return a.val()}},textarea:{$template:$('<textarea class="form-control js-input"/>'),build:function(a,b){a.attr("placeholder",b),a.attr("data-name",b),a.attr("data-type","textarea")},getValue:function(a){return a.val()}},bool:{$template:$('<div class="js-input"><label class="radio-inline"><input name="" checked class="js-true" type="radio" value="1"> true</label><label class="radio-inline"><input name="" type="radio" value="0"> false</label></div>'),build:function(a,b,c){a.attr("data-name",b),a.find("input").attr("name","column-"+b+"-"+c),a.attr("data-type","bool")},getValue:function(a){return a.find(".js-true").prop("checked")}},number:{$template:$('<input type="number" class="form-control table-input js-input"/>'),build:function(a,b){a.attr("data-name",b),a.attr("data-type","number")},getValue:function(a){return parseFloat(a.val(),10)}}},j={$th:$('<th class="m-heading m-input"><span class="name"/><small class="glyphicon glyphicon-remove pull-right js-remove"/></th>'),$td:$('<td class="m-input"/>'),$number:$('<td class="m-number"/>')},k=!1,l=function(a,b){var c=j.$th.clone(),d=j.$td.clone(),g=i[a].$template.clone();c.attr("data-name",b).find(".name").text(b),e.append(c),$tr=f.find("tr");for(var h=0;h<$tr.length;h++)i[a].build(g,b,h),d.attr("data-name",b).html("").append(g.clone()),$tr.eq(h).append(d.clone())},m=function(a){e.find("th[data-name="+a+"]").remove(),f.find("td[data-name="+a+"]").remove()},n=function(){var a=f.find("tr").last().clone(),b=a.find(".m-number");a.find("input.js-input").val(""),b.text(parseInt(b.text(),10)+1),a.find("input[type=radio]").each(function(){var a=this.getAttribute("name");a=a.replace(/\d+/,b.text()),this.setAttribute("name",a)}),a.appendTo(f)},o=function(){return!0},p=function(){},q=function(){var a=[];f.children("tr").each(function(){var b={};$(this).find(".js-input").each(function(){i[this.getAttribute("data-type")].getValue($(this))&&(b[this.getAttribute("data-name")]=i[this.getAttribute("data-type")].getValue($(this)))}),Object.getOwnPropertyNames(b).length>0&&a.push(b)}),h.val(JSON.stringify(a))};a.on("submit",function(a){a.preventDefault();var d=o();return d.error?p(d.errorText):l(b.val(),c.val()),!1}),d.on("click",".js-remove",function(){m($(this).parent().attr("data-name"))}),d.on("focus","tr:last-child .js-input",function(){k||n()}),g.on("click",q)},jQuery(document).ready(function(){jsonEditor()});
//# sourceMappingURL=main.map