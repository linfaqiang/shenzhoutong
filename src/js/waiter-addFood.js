;(function($, win, doc){
	$(function(){
		//选中包厢查看内容
		$('.room').on('click', 'li' ,function(){
			var that = $(this);
			if(that.hasClass('active')){
				that.addClass('activeBorder').siblings().removeClass('activeBorder');
			}
		});
		
		
		
		
		
		// 移动删除功能
		var pagex,pagey;
		var rm = $('.remove');
		var tran = $('.trans');
		var that = null,falg = false;
		tran.on('touchstart', function(e){
			var event = e.originalEvent.changedTouches[0];
			pagex = event.pageX;
			pagey = event.pageY;
			that = $(this);
			falg = false;
			rm.css({'transform' : 'translateX('+-(0)+'px)'});
			tran.css({'transform' : 'translateX('+-(0)+'px)'});
			
			
			
			
		}).on('touchend', function(){
			if(!falg){
				rm.css({'transform' : 'translateX('+-(0)+'px)'});
				tran.css({'transform' : 'translateX('+-(0)+'px)'});
				falg = false;
			}else{
				that.next().css({'transform' : 'translateX('+-(35)+'px)'});
				that.css({'transform' : 'translateX('+-(35)+'px)'});
			}
		});
		
		$('.right ul li').on('touchmove', function(e){
				var x, y;
				var event = e.originalEvent.changedTouches[0];
				pageMoveX = event.pageX;
				x = pageMoveX - pagex;
				y = event.pageY - pagey;
				if(Math.abs(x)<Math.abs(y)){
					
				   return
				}
				e.preventDefault();
				
				
				if(x<0){
					x =  Math.abs(x)>=70 ? 70 : Math.abs(x);
					if(x>=70){
						falg = true;
					}
					that.next().css({'transform' : 'translateX('+-(x/2)+'px)'});
					that.css({'transform' : 'translateX('+-(x/2)+'px)'});
				
				}
			});
			
		$('.remove').on('click', function(){
			$(this).parent('li').remove()
		});
		
		//用餐地点选择
		$('.mask li').on('click', function(){
			if($(this).attr('check')==1){
				$(this).removeClass('active').attr('check', 0);
			}else{
				$(this).addClass('active').attr('check', 1);
			}
		});
		// 用餐地点 确认 与 返回
		$('#return').on('click', function(){
			$('.mask').animate({'left': '-100%'});
			var arr = $('#enter').data('arr');
			arr = arr == undefined ? [] : arr;
			$('.mask li').removeClass('active').attr('check', 0);
			if(arr.length>0){
				for(var i = 0; i < arr.length; i++ ){
					$('.mask li').eq(arr[i]).addClass('active').attr('check', 1);
				}
			}
		});
		
		$('#enter').on('click', function(){
			var str = '', arr = [];
			$('.mask li').each(function(index, ele){
				var that= $(this);
				if(that.attr('check') == '1' && that.hasClass('active')){
					str += that.html()+',';
					arr.push(index);
				}
			});
			$(this).data('arr',arr.toString());
			$('#address').val(str.substr(0,str.length-1));
			$('.mask').animate({'left': '-100%'});
		});
		//订餐中点击选择按钮
		$('#choiceAddr').on('click', function(){
			$('.mask').animate({'left': '0'});
			
		});	
		
	})	
})(jQuery, window, document);
