window.onload = function(){
    var oStar = document.getElementById("star");
    var ali = oStar.getElementsByTagName("li");
    var oUl = oStar.getElementsByTagName("ul")[0];
    var oSpan = oStar.getElementsByTagName("span")[1];
    var op = oStar.getElementsByTagName("P")[0];
    var i = iScore = iStar = 0;
    
    var aMsg = [
        "很不满意|差得太离谱，与卖家描述的严重不符，非常不满",
        "不满意|部分有破损，与卖家描述的不符，不满意",
        "一般|质量一般，没有卖家描述的那么好",
        "满意|质量不错，与卖家描述的基本一致，还是挺满意的",
        "非常满意|质量非常好，与卖家描述的完全一致，非常满意"
    ];
    for (i = 1; i <= ali.length; i++) {
        var _index = ali[i - 1];
        _index.index = i;
        // 鼠标移入显示分数
        _index.onmouseover = function () {
            point(this.index);
            // 显示浮层
            op.style.display = "block";
            // 计算浮层位置
            op.style.left = oUl.offsetLeft + this.index * this.offsetWidth - 104 + 'px';
            // 浮层文字内容
            op.innerHTML = "<em><b>" + this.index + "</b> 分" + aMsg[this.index - 1].match(/(.+)\|/)[1] + "</em>" + aMsg[this.index - 1].match(/\|(.+)/)[1]
        };
        //鼠标移除回复上次分数
        _index.onmouseout = function () {
            point();
            op.style.display = "none";
        };
        // 点击后进行评分
        _index.onclick = function () {
            iStar = this.index;
            op.style.display = "none";
            oSpan.innerHTML = "<strong>" + (this.index) + "分</strong>（" + aMsg[this.index - 1].match(/\|(.+)/)[1] + ")";
        }
    }

    function point(iarg) {
        iScore = iarg || iStar;
        for (i = 0; i < ali.length; i++) ali[i].className = i < iScore ? "on" : "";
    }
}