$(document).ready(function(){
 //数量
 var deshNum=$('.right ul li').size();
 $('.deshNum').html(deshNum);
 //任务编号
 $('#daskNumber').on('click',function(){
 	$('.warp').hide();
 	$('.taskNum').show();
 });
 //取消2
 $('.cancel2').on('click',function(){
 	$('.taskNum').hide();
 	$('.warp').show();
 });
 //近一次
 $('.one').on('click',function(){
 	 $('.warp').hide();
 	 $('.record-container').show();
 });
 //取消
 $('.cancel').on('click',function(){
 	$('.record-container').hide();
 	$('.warp').show();
 });
 //确认
 $('.determine').on('click',function(){
 	var html='';
 	var historyArr=[];
 	var liSize=$('.right ul li').size();
    $('.record-container dl dd').each(function(index){
    	var historyobj={};
    	   historyobj.name=$('.record-container dl dd').eq(index).find('.deshName').html();
    	   historyobj.share=$('.record-container dl dd').eq(index).find('.share').html();
    	   historyobj.flavorWb=$('.record-container dl dd').eq(index).find('.flavor').children('.wb').html();
    	   historyobj.flavorQb=$('.record-container dl dd').eq(index).find('.flavor').children('.qb').html();
            historyArr.push(historyobj);
           console.log(historyArr);
    	if($('.allCheckbox').prop('checked')){
    	   liSize++;
           html+='<li data-id='+liSize+'><div class="trans"><div class="count"><div class="mui-numbox" data-numbox-step="1" data-numbox-min="0" data-numbox-max="100"><button class="mui-btn numbox-btn-minus" type="button">-</button><input class="numberPut" type="number" value='+historyobj.share+'><button class="mui-btn numbox-btn-plus" type="button">+</button></div></div><div class="name"><h2>'+liSize+'、'+historyobj.name+'</h2><p><span class="price-area">18元</span><span class="w-wrap" data-wid="15">'+historyobj.flavorWb+'</span><span class="q-wrap" data-qid="115">'+historyobj.flavorQb+'</span></p></div></div><div class="remove">删除</div></li>';        
    	}else if($('.record-container dl dd').eq(index).find('input').prop('checked')){
    		liSize++;
            html+='<li data-id='+liSize+'><div class="trans"><div class="count"><div class="mui-numbox" data-numbox-step="1" data-numbox-min="0" data-numbox-max="100"><button class="mui-btn numbox-btn-minus" type="button">-</button><input class="numberPut" type="number" value='+historyobj.share+'><button class="mui-btn numbox-btn-plus" type="button">+</button></div></div><div class="name"><h2>'+liSize+'、'+historyobj.name+'</h2><p><span class="price-area">18元</span><span class="w-wrap" data-wid="15">'+historyobj.flavorWb+'</span><span class="q-wrap" data-qid="115">'+historyobj.flavorQb+'</span></p></div></div><div class="remove">删除</div></li>';
    	}

    });
    $('.right ul').append(html);
    $('.record-container').hide();
 	$('.warp').show();
 	//数量
	deshNum=$('.right ul li').size();
    $('.deshNum').html(deshNum);
    shop.count();
 });
 //任务编号
 $('.determine2').on('click',function(){
 	  var taskNum,taskName,taskCount;
 	$('.taskNum ul li').each(function(index){
       if($('.taskNum ul li').eq(index).find('input').prop('checked')){
       	  taskNum=$('.taskNum ul li').eq(index).find('.taskN').html();
       	  taskName=$('.taskNum ul li').eq(index).find('.taskD').html();
       	  taskCount=$('.taskNum ul li').eq(index).find('.taskC').html();
       }
 	});
 	$('#daskNumber').val(taskNum);
 	$('#daskName').val(taskName);
 	$('#daskCount').val(taskCount);
 	$('.taskNum').hide();
 	$('.warp').show();
 });
 //单选
  $('.taskNum ul li').on('click', function () {
      $(':radio').prop('checked', false);
      $(this).find(':radio').prop('checked', true);
  });
  //全选父级
  $('.record-container dl dt').on('click', function () {
      if (!$(this).find('.allCheckbox').prop('checked')) {
          $(this).find('.allCheckbox').prop('checked', true);
          $('.record-container dl dd').find(':checkbox').prop('checked', true);
      } else {
          $(this).find('.allCheckbox').prop('checked', false);
          $('.record-container dl dd').find(':checkbox').prop('checked', false);
      }
  });
  //全选自己
  $('.record-container .allCheckbox').on('click', function () {
      if (!$(this).prop('checked')) {
          $(this).prop('checked', true);
          $('.record-container dl dd').find(':checkbox').prop('checked', true);
      } else {
          $(this).prop('checked', false);
          $('.record-container dl dd').find(':checkbox').prop('checked', false);
      }
  });
  //多选父级
  $('.record-container dl dd').on('click', function () {
      if (!$(this).find(':checkbox').prop('checked')) {
          $(this).find(':checkbox').prop('checked', true);
      } else {
          $(this).find(':checkbox').prop('checked', false);
      }
  });
  //多选自己
  $('.record-container dl dd').find(':checkbox').on('click', function () {
      if (!$(this).prop('checked')) {
          $(this).prop('checked', true);
      } else {
          $(this).prop('checked', false);
      }
  });
 //点菜
 var dataList=[];
 $('.primary').on('click',function(){
 	var dataItem={};
 	var content=[];
 	    dataItem.personName=$('.list-box li').eq(0).find('input').val();
 	    dataItem.iden=$('.list-box li').eq(1).find('input').val();
 	    dataItem.name=$('.list-box li').eq(2).find('input').val();
 	    dataItem.amount=$('.list-box li').eq(3).find('input').val();
 	    dataItem.time=$('.list-box li').eq(4).find('input').val();
 	    dataItem.personNum=$('.list-box li').eq(5).find('input').val();
 	    
    $('.right ul li').each(function(index){  
        var second={};                 
        second.id=$('.right ul li').eq(index).attr('data-id');
        second.num=$('.right ul li').eq(index).find('input').val();
        second.price=parseFloat($('.right ul li').eq(index).find('.price-area').html());
        second.wType=$('.right ul li').eq(index).find('.w-wrap').attr('data-wid');
        second.qType=$('.right ul li').eq(index).find('.q-wrap').attr('data-qid');
        content.push(second);
        
     });
     dataItem.content=content;
   dataList.push(dataItem);
   console.log(dataList);
 });

 //金额计算
 var shop={
       add: 0,   //加数量
    reduce: 0,  //减数量                    
    inputs: document.getElementsByClassName('numberPut'),
    prices: document.getElementsByClassName('price-area'),
     total: document.querySelector('.deshTotal'),
     count:function(){
       this.total.innerHTML=0;
        var count=0;
        for(var i=0;i<this.inputs.length;i++){
        	  console.log(this.inputs.length); 
        	  var area=this.prices[i].innerHTML.substring(0,this.prices[i].innerHTML.length-1);
           count+=parseInt(this.inputs[i].value)*parseFloat(area);
       }
       count=count.toFixed(2);

       this.total.innerHTML=count+'元';
     }
  };
  shop.count();

  $(document).on('tap','.numbox-btn-plus',function(){
  	var next=parseInt($(this).siblings('input').val());
        shop.add=next+1;
        $(this).siblings('input').val(shop.add);         
  	    shop.count();
  });
  $(document).on('tap','.numbox-btn-minus',function(){
  	var prev=parseInt($(this).siblings('input').val());
        if(prev<=1){
         prev=0;
         shop.reduce=0;
         $(this).siblings('input').val(shop.reduce);
        }else{
         shop.reduce=prev-1;
         $(this).siblings('input').val(shop.reduce);
        }  
  	shop.count();
  });














});