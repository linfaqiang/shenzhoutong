$(document).ready(function () {
    //数量
    var deshNum = $('.right ul li').size();
    $('.deshNum').html(deshNum);

    //任务编号
    $('#daskNumber').on('click', function () {
        $('.warp').hide();
        $('.taskNum').show();
    });
    //取消2
    $('.cancel2').on('click', function () {
        $('.taskNum').hide();
        $('.warp').show();
    });

    //任务编号
    $('.determine2').on('click', function () {
        var taskNum, taskName, taskCount;
        $('.taskNum ul li').each(function (index) {
            if ($('.taskNum ul li').eq(index).find('input').prop('checked')) {
                taskNum = $('.taskNum ul li').eq(index).find('.taskN').html();
                taskName = $('.taskNum ul li').eq(index).find('.taskD').html();
                taskCount = $('.taskNum ul li').eq(index).find('.taskC').html();
            }
        });
        $('#daskNumber').val(taskNum);
        $('#daskName').val(taskName);
        $('#daskCount').val(taskCount);
        $('.taskNum').hide();
        $('.warp').show();
    });
    //单选
    $(':radio').on('click', function () {
        $(':radio').prop('checked', false);
        $(this).prop('checked', true);
    });
    //全选
    $('.allCheckbox').on('click', function () {
        if ($(this).prop('checked')) {
            $(':checkbox').not(".allCheckbox").prop('checked', true);
        } else {
            $(':checkbox').not(".allCheckbox").prop('checked', false);
        }
    });
    //点菜获取数据
    function getData() {
        var dataItem = {};
        var content = [];
        var addContent = [];
        dataItem.ORDER_ID = $("#ORDER_ID").val();
        dataItem.DINNER_TIME = $('.list-box li').eq(4).find('input').val();
        dataItem.NUMBER_DINE = $('.list-box li').eq(5).find('input').val();
        dataItem.REMARKS = $('textarea').val();
        //加菜
        $('.add-li div').each(function (index) {
            var add = {};
            add.PRODUCT_NAME = $('.add-li div').eq(index).find('h2').html();
            add.PRODUCT_ID = $('.add-li div').eq(index).attr("data-index");
            add.SPICY_ID = $('.add-li div').eq(index).attr("data-wid");
            add.TASTE_ID = $('.add-li div').eq(index).attr("data-qid");
            add.CATEGORY_ID = $('.add-li div').eq(index).attr("type-id");
            add.num = $('.add-li div').eq(index).find('b').html();
            addContent.push(add);
        });
        dataItem.productList = addContent;
        return JSON.stringify(dataItem);
    }
    //点菜--订餐人原有菜品
    $('.primary').on('click', function () {
        var _data = getData();
        //客户端缓存
        window.sessionStorage.WaiterOrderInfo_Data = _data;
        window.location.href = '@Url.Action("DeliciousFoodGet", "OrderPerson")';
    });

    //金额计算
    var shop = {
        add: 0,   //加数量
        reduce: 0,  //减数量                    
        inputs: document.getElementsByClassName('numberPut'),
        prices: document.getElementsByClassName('price-area'),
        total: document.querySelector('.deshTotal'),
        count: function () {
            this.total.innerHTML = 0;
            var count = 0;
            for (var i = 0; i < this.inputs.length; i++) {
                //console.log(this.inputs.length); 
                var area = this.prices[i].innerHTML.substring(0, this.prices[i].innerHTML.length - 1);
                count += parseInt(this.inputs[i].value) * parseFloat(area);
            }
            count = count.toFixed(2);

            this.total.innerHTML = count;
        }
    };
    shop.count();
    $('.right ul li').each(function (index) {
        var sumCount=$('.right ul li').eq(index).find('input').val();
        $('.right ul li').eq(index).attr('data-id', index);
        $('.right ul li').eq(index).attr('data-sum', sumCount);
    });
    var str = '';
    var total = parseFloat($('.deshTotal').html());
    $(document).on('tap', '.numbox-btn-plus', function () {
        $(".add-li").removeClass("none");
        $(this).siblings('.numbox-btn-minus').removeAttr('disabled')
        var wid = $(this).parents('.count').siblings('.name').find('.w-wap').attr('data-wid');
        var qid = $(this).parents('.count').siblings('.name').find('.q-wap').attr('data-qid');
        var text = $(this).parents('.count').siblings('.name').find('h2').html();
        var ids = $(this).parents('li').attr('data-id');
        var val = $(this).siblings('input').val();
        var typeId = $(this).parents('li').attr('type-id');
        var price = $(this).parents('.count').siblings('.name').find('.price-area').html();
        price = parseFloat(price.substring(0, price.length - 1));
        var jia = 1;
        var dataSum = $(this).parents('li').attr('data-sum');
            dataSum++;

            $(this).parents('li').attr('data-sum',dataSum);
        str = '<div class="name-wrap" type-id=' + typeId + ' data-index=' + ids + ' data-wid=' + wid + ' data-qid=' + qid + '><h2>' + text + '</h2><p>数量：+<b>' + jia + '</b></p></div>';
        
        var size = $(".add-li div[data-index=" + ids + "]").size();
        if (size == 0) {
            jia++;
            $('.add-li').append(str).show();
            total = total + price;
            $('.deshTotal').html(total);
            
        } else {
            var num = parseInt($(".add-li div[data-index=" + ids + "]").find('b').html());
            $(".add-li div[data-index=" + ids + "]").find('b').html(num + 1);
            console.log(num);
            total = total + price; ;
            $('.deshTotal').html(total);
            if(dataSum==val){
               $(".add-li div[data-index=" + ids + "]").remove();
                if($('.add-li div').size() == 0){
                   $(".add-li").hide();
                }
                
            }
            
        }



    });

    $(document).on('tap', '.numbox-btn-minus', function () {
        $(".add-li").removeClass("none");
        var wid = $(this).parents('.count').siblings('.name').find('.w-wap').attr('data-wid');
        var qid = $(this).parents('.count').siblings('.name').find('.q-wap').attr('data-qid');
        var text = $(this).parents('.count').siblings('.name').find('h2').html();
        var val = $(this).siblings('input').val();
        var price = $(this).parents('.count').siblings('.name').find('.price-area').html();
        price = parseFloat(price.substring(0, price.length - 1));
        var dataSum = $(this).parents('li').attr('data-sum');
            dataSum--;
            $(this).parents('li').attr('data-sum',dataSum);
        var jian = -1;
        var ids = $(this).parents('li').attr('data-id');
        str = '<div class="name-wrap" data-index=' + ids + ' data-wid=' + wid + ' data-qid=' + qid + '><h2>' + text + '</h2><p>数量：<b>' + jian + '</b></p></div>';
        var size = $(".add-li div[data-index=" + ids + "]").size();
        if (size == 0) {
            jian--;
            $('.add-li').append(str).show();
            total = total - price;
            $('.deshTotal').html(total);
        } else {
            var num = parseInt($(".add-li div[data-index=" + ids + "]").find('b').html());
            $(".add-li div[data-index=" + ids + "]").find('b').html(num - 1);
            total = total - price;
            $('.deshTotal').html(total);
            console.log(num);
            if (dataSum==val) {
                if ($('.add-li div').size() == 1) {
                    $('.add-li').hide();
                    $(".add-li div[data-index=" + ids + "]").remove();
                    deshNum--;
                    $('.deshNum').html(deshNum);
                    //$(this).attr('disabled', 'disabled');
                } else {
                    $(".add-li div[data-index=" + ids + "]").remove();
                    deshNum--;
                    $('.deshNum').html(deshNum);
                    //$(this).attr('disabled', 'disabled');
                }
            }else if(dataSum==0){
                $(this).attr('disabled', 'disabled');
            }
        }
    });
});