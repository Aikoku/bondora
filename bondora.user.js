// ==UserScript==
// @name        Bondora
// @author      KoSMoS
// @description bondoraPro
// @include         *bondora.com/en/secondmarket*
// @version     3
// @updateURL       https://github.com/konstantinsp/bondora/blob/master/bondora.user.js
// @downloadURL     https://github.com/konstantinsp/bondora/blob/master/bondora.user.js
// @grant       none
// @run-at      document-end
// ==/UserScript==


$("#sidebar-wrapper").append("<style>#bondora-helper{position: fixed;width: 249px;top: 378px;padding: 5px;left: 0;}</style>");
$("#sidebar-wrapper").append("<style>.kosmos-input{width: 40%;}</style>");
$("#sidebar-wrapper").append("<div id='bondora-helper'>" 
	+ "<div>Cost</div>"
	+ "<input type='text' class='kosmos-input' id='kosmos-from' placeholder='From %' value='10'>" 
	+ "<input type='text' class='kosmos-input' id='kosmos-to' placeholder='To %' value='100'>" 
	+ "<input type='text' id='kosmos-color' placeholder='Color(#eeefef)' value='#9bf55c'>" 
	+ "<button id='kosmos-apply'>Highlight</button>" 
	
	+ "<div>Payments left</div>"
	+ "<div><input type='text' id='kosmos-paymentsleft' value='6' placeholder='Max payments left'></div>"
	+ "<button id='kosmos-apply2'>Highlight</button>" 
  + "<button id='kosmos-calculatePercent'>Calculate Percent</button>" 
	+ "</div>");

$("#kosmos-apply").click(function(){
	highlight();
});
$("#kosmos-apply2").click(function(){
	highlight2();
});
$("#kosmos-calculatePercent").click(function(){
	calculatePercent();
});
	
function calculatePercent(){
	
	//find Future scheduled payments column
	var colIndex = -1;
	var ths = $(".investments > thead > tr > th");
	ths.each(function(index){
		if($(this).html().indexOf("Future scheduled payments") > -1){
			colIndex = index;
			
		}
	});
	
	//if(colIndex == -1) return;//column not found
	
	if($(".investments > thead > tr > th.percent-th").length == 0){
		$("<th class='percent-th'>Percent</th>").insertAfter(ths.eq(colIndex));
	}
	
	
	
	$(".investments > thead > tr > th").eq(colIndex)
	
	$(".investments > tbody").find(" > tr").each(function(){
		var tds = $(this).find(" > td");
		
		if(tds.length < 3) return;
		
		//cost
		var textCost = $(this).find(".item-cost").eq(0).html();
		var result = textCost.match( /([0-9.]+)/g );
		var cost = parseFloat(result[0]);
		
		//total
		var textTotal = tds.eq(colIndex).html();
		var matches = textTotal.match(/([0-9.]+)/);
		var total = parseFloat(matches[1]);
		
		//calculate percent
		var percent = Math.round(((total - cost) * 100) / cost);
		
		
		//place col
		if($(this).find(".percent").length > 0){
			//replace
			$(this).find(".percent").html(percent + "%");
		}else{
			//insert
			$("<td class='percent'>" + percent + "%</td>").insertAfter(tds.eq(colIndex));
		}
		
		console.log(percent);
		
	});
	
	
	//console.log(colIndex);
}

function highlight(){	
	$(".investments").find(".item-cost").each(function(){
		//reset color 
		$(this).closest("td").css("background-color", "#eeefef");//#eeefef
	
		var text = $(this).html();
		var result = text.match( /[0-9.€ ]+\(([0-9]+)%\)/ );
		var percent = parseInt(result[1], 10);
		
		var from = parseInt($("#kosmos-from").val(), 10);
		var to = parseInt($("#kosmos-to").val(), 10);
		
		var color =  $("#kosmos-color").val()//"#eeefef";
		
		if(percent >= from && percent <= to)
			$(this).closest("td").css("background-color", color);//#eeefef
		
		/*
		if(percent > 10) color = "#e6f55c";
		if(percent > 15) color = "#9bf55c";
		if(percent > 20) color = "#37f033";
		
		$(this).closest("td").css("background-color", color);//#eeefef
		*/
		//console.log(percent);
	});
}


function highlight2(){
	$(".investments tbody").find("tr").each(function(){
		var tds = $(this).find(" > td");
		if(tds.length < 2) return;
		
		var text = tds.eq(6).html();
		
		var matches = text.match(/([0-9]+) \/ ([0-9]+)/);
		
		var total = parseInt(matches[2], 10);
		var current = parseInt(matches[1],10);
		
		var left = total - current;
		
		tds.eq(6).html(current + " / " + total + " = " + left);
		
		var paymentsleft = parseInt($("#kosmos-paymentsleft").val(), 10);
		
		if(left <= paymentsleft)
			tds.eq(6).css("background-color", "#9bf55c");
		else 
			tds.eq(6).css("background-color", "#fff");
		
		
		//console.log(left);
		//7
	});
}

