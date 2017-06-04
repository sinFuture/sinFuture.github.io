/**
* title: 网易前端大作业
* author: 苏火强
* date: 2016-3-26
*/

//通过id获取元素
function $(id){
    return document.getElementById(id);
}
//事件通用注册
function addEvent(ele,type,fn){
    if(ele.attachEvent){
        ele.attachEvent("on"+type,fn);
    }else{
        ele.addEventListener(type,fn,false);
    }
}

//获取dataset，兼容IE
function getDataset(ele){
    if(ele.dataset){
        return ele.dataset;
    }else{
        var attr=ele.attributes;                         //获取属性
        var dataset={};                                  //定义空的属性值接收对象
        for (var i = 0; i < attr.length; i++) {          //遍历属性
            if(/^data-/.test(attr[i].nodeName)){         //匹配自定义属性
                var name=attr[i].nodeName.slice(5).toLowerCase().replace(/-(.)/g,function(match,p1){
                    return p1.toUpperCase()});           //获取自定义属性名称，并按camel语法改写
            }
            dataset[name]=attr[i].nodeValue;             //获取自定义属性的值，并加入dataset对象中
        }
    }
    return dataset;
}

//读取cookie
function getCookie(Name) {
    var cookie = {};
    var all = document.cookie;
    if (all === '')
        return null;
    var list = all.split(';');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p).trim();
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie[Name];
}

//设置cookie
function setCookie(name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    if (expires)
        cookie += ';expires=' + expires.toGMTString();
    if (path)
        cookie += ';path=' + path;
    if (domain)
        cookie += ';domain=' + domain;
    if (secure)
        cookie += ';secure=' + secure;
    document.cookie = cookie;
}

//删除cookie
function removeCookie(name, path, domain) {
    setCookie(name, '', new Date(0), path, domain);
}

//cookie失效期
var expireDate=new Date(2018,1);

//关闭提醒
(function closeNotice(){
    var _notice=$('j-notice');
    var _p=_notice.getElementsByTagName("p")[1];
    if(getCookie("isClose")){
        _notice.style.display="none";
    }else{
        addEvent(_p,"click",function(){
            _notice.style.display="none";
            setCookie("isClose",true,expireDate);
        });
    }
})();

//login输入文字时，提示文字隐藏
var login=$("j-login");
var input=login.getElementsByTagName('input');
var label=login.getElementsByTagName("label");
function wordHidden(i){
    addEvent(input[i],"focus",function(){
       label[i].style.display="none";
    });
    addEvent(input[i],"blur",function(){
        if(this.value===""){
            label[i].style.display="block";
        }
    })
}
wordHidden(0);
wordHidden(1)

//登录
var _attention=$('j-attention');
var _cancel=$("j-cancel");
var _count=$("j-count");
var _submit=getElementsByClassName(login,"submit");
var shut=getElementsByClassName(login,"shut");

//关注与非关注状态样式设置
function followSuccess(){
    _attention.innerHTML="已关注";
    _attention.disabled=true;
    _attention.className="active f-fl";
    _cancel.style.display="block";
    _count.textContent="46";
}
function followFail(){
    _attention.innerHTML="关注";
    _attention.disabled=false;
    _attention.className="follow f-fl f-csp";
    _cancel.style.display="none";
    _count.textContent="45";
}

//检测登录cookie值
(function checkFollow(){
    var _loginSuc=getCookie("loginSuc");
    if(_loginSuc){
        followSuccess();
    }else{
        followFail()
    }
})();




//取消关注
addEvent(_cancel,"click",function(){
    removeCookie("followSuc");
    removeCookie("loginSuc");
    followFail();
});

//关闭登录窗口
addEvent(shut[0],"click",function(){
    login.style.display="none";
});

//关注
addEvent(_attention,"click",function(){
    var _loginSuc=getCookie("loginSuc");
    if(_loginSuc){
        followSuccess();
    }else{
        login.style.display="block";
    }

});
function follow(){
    ajax({
        method:"get",
        url:"http://study.163.com/webDev/attention.htm",
        data:{},
        success:function(data){
            if(data==='1'){
                setCookie ('followSuc',true, expireDate);
                followSuccess();
            }
        }
    });
}

//登录提交
addEvent(_submit[0],"click",function(){
    var _userName=hex_md5(input[0].value);
    var _password=hex_md5(input[1].value);
    ajax({
        method:"get",
        url:"http://study.163.com/webDev/login.htm",
        data:{userName:_userName,password:_password},
        success:function(data){
            if(data==='1'){
                login.style.display="none";
                setCookie ('loginSuc',true, expireDate);
                follow();
            }else{
                alert("账号密码错误，请重新输入");
            }
        }
    });
});

//轮播图
function imgSlide(){
    var _slide=$("j-slide");
    var _a=_slide.getElementsByTagName("a")[0];
    var _img=_a.getElementsByTagName("img")[0];
    var _ul=_slide.getElementsByTagName("ul")[0];
    var _pli=_slide.getElementsByTagName("li");
    var timer;
    var _data=[
        {link: 'http://open.163.com/' , src : 'images/banner1.jpg'},
        {link: 'http://study.163.com/' , src : 'images/banner2.jpg'},
        {link: 'http://www.icourse163.org/' , src : 'images/banner3.jpg'}
    ];
    var _l=_data.length;
    for(var i=0;i<_l;i++) {
        var _li = document.createElement("li");
        var _Num = document.createTextNode(i + 1);
        var num = 0;
        _ul.appendChild(_li);
        _li.appendChild(_Num);
        _a.href = _data[0].link;
        _img.src = _data[0].src;
        _pli[0].className = 'active';
        _pli[i].index = i;
        addEvent(_pli[i], "click", function () {
            num = this.index;
            slideAnimate(this.index);
        });
    }
    var viewWidth=parseFloat(document.body.clientWidth);
    _ul.style.left=(viewWidth-20*_pli.length)/2 + "px";
    addEvent(window,"resize",function(){
        viewWidth=parseFloat(document.body.clientWidth);
        _ul.style.left=(viewWidth-20*_pli.length)/2 + "px";
    })
    function slideAnimate(index){
        _img.style.opacity=0;
        _img.style.transition="";
        for(var i=0;i<_l;i++){
            _pli[i].className="";
        }
        _a.href=_data[index].link;
        _img.src=_data[index].src;
        _pli[index].className="active";
        setTimeout(function(){
            _img.style.transition="0.5s";
            _img.style.opacity=1;
        },30)
    }
    function autoPlay(){
        timer=setInterval(function () {
            num=(num+1)%_l;
            slideAnimate(num);
        },5000);
    }
    addEvent(_slide,"mouseover",function(){
       clearInterval(timer);
    });
    addEvent(_slide,"mouseout",function(){
       autoPlay();
    });
    autoPlay();
}
imgSlide();

//通过类获取元素方法封装
function getElementsByClassName(element, names) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result = [];
        var element,
            classNameStr,
            flag;
        names = names.split(' ');
        for (var i = 0; element = elements[i]; i++) {
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for (var j = 0, name; name = names[j]; j++) {
                if (classNameStr.indexOf(' ' + name + '') == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push(element);
            }
        }
        return result;
    }
}

//获取元素样式
function getStyle (obj,attr) {
    if( obj.currentStyle ){
        return obj.currentStyle[attr];
    }
    else{
        return getComputedStyle(obj)[attr];
    }
}

//参数序列化
function serialize (data){
    if (!data) return '';
    var pairs = [];
    for (var name in data){
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}

//封装ajax方法
function ajax(obj){
    var xhr=new XMLHttpRequest();
    obj.data =serialize(obj.data);
    if (obj.method === 'get'){
        obj.url += obj.url.indexOf('?') === -1 ? '?' + obj.data : '&' + obj.data;
    }
    xhr.onreadystatechange=function(){
        if(xhr.readyState===4){
            if(xhr.status===200){
                obj.success(xhr.responseText);
            }
        }
    }
    xhr.open(obj.method, obj.url,true);
    if (obj.method === 'post') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(obj.data);
    } else {
        xhr.send(null);
    }
}

//获取课程列表
function getDataToTab(){
    var _tab=$('j-tab');
    var _btn=getElementsByClassName(_tab,'btn');
    var _proDesign=getElementsByClassName(_tab,'pro-design');
    var _proLanguage=getElementsByClassName(_tab,'pro-language');
    var _page=$("j-page");
    var _main=$("j-main");
    function setObjData(num,ele,pageNo,len){
        ajax({
            method: 'get',
            url: 'http://study.163.com/webDev/couresByCategory.htm',
            data: {
                'pageNo': pageNo,
                'psize': 20,
                'type': num
            },
            success:function(data){
                var _data=JSON.parse(data);
                ele.innerHTML="";
                for(var i=0;i<len;i++){
                    var _course=document.createElement("div");
                    _course.className="m-course";
                    ele.appendChild(_course);
                    var _img=document.createElement("img");
                    var _p=document.createElement("p");
                    var _div=document.createElement("div");
                    var _span=document.createElement("span");
                    var _strong=document.createElement("strong");
                    var _a=document.createElement("a");
                    _img.src=_data.list[i].middlePhotoUrl;
                    _p.className="courseName f-toe";
                    _p.innerHTML=_data.list[i].name;
                    _div.className="provider";
                    _div.innerHTML=_data.list[i].provider;
                    _span.innerHTML=_data.list[i].learnerCount;
                    _a.innerHTML='<img src="' + _data.list[i].middlePhotoUrl +'" /><h3>' + _data.list[i].name + '</h3><span>' + _data.list[i].learnerCount + '人在学</span><p class="categoryname">发布者：' + _data.list[i].provider + '</br>分类：' + _data.list[i].categoryName + '</p><p class="description">' +  _data.list[i].description.trim() + '</p>';
                    if( _data.list[i].price == 0){
                        _strong.innerHTML = '免费';
                    }else{
                        _strong.innerHTML = '￥' + _data.list[i].price;
                    }
                    _course.appendChild(_img);
                    _course.appendChild(_p);
                    _course.appendChild(_div);
                    _course.appendChild(_span);
                    _course.appendChild(_strong);
                    _course.appendChild(_a);
                }
            }
        });
    }
    if(_main.clientWidth===963){
        setObjData(10,_proDesign[0],1,15);
        setObjData(20,_proLanguage[0],1,15);
    }else{
        setObjData(10,_proDesign[0],1,20);
        setObjData(20,_proLanguage[0],1,20);
    }
    var resizeTimer = null;
    function doResize(){
        window.location.reload();
    }
    addEvent(window,"resize",function(){
        resizeTimer = resizeTimer ? null : setTimeout(doResize,0);
    })
    addEvent(_btn[0],"click",function(){
        _proDesign[0].style.display = 'block';
        _btn[0].className = 'btn select';
        _proLanguage[0].style.display = 'none';
        _btn[1].className = 'btn';
    });
    addEvent(_btn[1],"click",function(){
        _proDesign[0].style.display = 'none';
        _btn[0].className = 'btn';
        _proLanguage[0].style.display = 'block';
        _btn[1].className = 'btn select';
    });
    addEvent(_page,"click",function(e){
        if(e.target && e.target.nodeName.toLowerCase()==="a"){
            getElementsByClassName(e.target.parentNode,"active")[0].className="";
            e.target.setAttribute("class","active");
            var index=getDataset(e.target).index;
            if(_btn[0].className=="btn select"){
                if(_main.clientWidth===963){
                    setObjData(10,_proDesign[0],index,15);
                }else{
                    setObjData(10,_proDesign[0],index,20);
                }
            }else{
                if(_main.clientWidth===963){
                    setObjData(20,_proLanguage[0],index,15)
                }else{
                    setObjData(20,_proLanguage[0],index,20);
                }
            }
        }
    });
}
getDataToTab();

//视频播放
function videoPlay(){  //弹出视频层
    var _hot = $('j-hot');
    var _video= getElementsByClassName(_hot, 'm-video');
    var _videoPlay = getElementsByClassName(_hot, 'videoPlay');
    var _shut = getElementsByClassName(_hot, 'shut');
    var _videoB = _hot.getElementsByTagName('video')[0];
    var _load=$("j-load");
    addEvent(_video[0],"click", function(){
        _videoPlay[0].style.display = 'block';
        _load.src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4";
    });
    addEvent(_shut[0],"click",function(){
        _videoPlay[0].style.display = 'none';
        _videoB.pause();
    });
}
videoPlay();

//设置热门课程列表
function setHotCourse(){
    var _hot=$('j-hot');
    var _slideBox=getElementsByClassName(_hot,'m-slideBox');
    ajax({
        method: 'get',
        url: 'http://study.163.com/webDev/hotcouresByCategory.htm',
        data: {},
        success:function(data){
            var _data=JSON.parse(data);
            var l=_data.length;
            for(var i=0;i<l;i++){
                var _a=document.createElement('a');
                _a.innerHTML= '<div><img src="' + _data[i].smallPhotoUrl + '" /></div><p>' + _data[i].name + '</p><span>' + _data[i].learnerCount + '</span>';
                _slideBox[0].appendChild(_a);
            }
        }
    });
}
setHotCourse();

//热门课程列表动画
function hotCourseSlide(){
    var _hot = $('j-hot');
    var _slideBox = getElementsByClassName(_hot, 'm-slideBox');
    var _hotCourse = getElementsByClassName(_hot, 'm-hot');
    var _timer;
    function autoPlay(){
        _timer = setInterval(function(){
            if( _slideBox[0].style.top == '-700px'){
                _slideBox[0].style.top = 0;
            }
            else{
                _slideBox[0].style.top = parseFloat(getStyle(_slideBox[0],'top')) - 70 + 'px';
            }
        },5000);
    }
    autoPlay();
    addEvent(_hotCourse[0],"mouseover",function(){
        clearInterval( _timer );
    })
    addEvent(_hotCourse[0],"mouseout",function(){
        autoPlay();
    })
}
hotCourseSlide();







