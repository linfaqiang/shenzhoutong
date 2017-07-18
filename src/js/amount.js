 //金额计算
 function Amount(nodeNum,nodePrice,nodeCount){
    this.number=document.getElementsByClassName(nodeNum);
    this.prices=document.getElementsByClassName(nodePrice);
    this.count =document.querySelector(nodeCount);
 }
 Amount.prototype.showCount=function(){
 	this.count.innerHTML=0;
 	var count=0;
 	for(var i=0;i<this.number.length;i++){
    var area=this.prices[i].innerHTML.substring(0,this.prices[i].innerHTML.length-1);
        count+=parseInt(this.number[i].innerHTML)*parseFloat(area);
    }
    count=count.toFixed(2);
    this.count.innerHTML=count+'元';
 };