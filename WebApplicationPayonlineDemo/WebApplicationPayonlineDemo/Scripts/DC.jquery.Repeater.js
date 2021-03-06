﻿/// <reference path="jquery-easyui-1.4.4/jquery.easyui.min.js" />
/// <reference path="jquery.reveal.js" />
/// 
/// 
// http://www.jb51.net/article/24257.htm
var container;
var URL_loaddata;
var itemCreated;
var _limit;
jQuery.fn.extend({

    Repeater: function (url_loaddata, url_gettotalcount, pagesize, ItemCreatedCallBack) {//设置或取得数据源
        container = $(this);
        URL_loaddata = url_loaddata;
        _limit = pagesize;
        itemCreated = ItemCreatedCallBack;
        $(this).after('<div id="callBackPager"></div>');
        $(this).after('<div id="myModal" class="reveal-modal"><img src="/images/loading_new.gif"><p style="font-family:微软雅黑;font-size:small; color=#6A5ACD">加载中...</p></div>');
        window.scrollTo(0, $(this).offset().top - 20);
        // 显示第一页内容
        showPage(container, url_loaddata, 1, pagesize, ItemCreatedCallBack, true);
    },
    RepeaterClear: function () {//清除数据
        this.each(function () {
            if ($(this).data("_ItemTemplate") == null) {
                $(this).data("_ItemTemplate", $(this).find(".itemtemplate").toHTML());
            }
            $(this).find(".itemtemplate").remove();
        });
    },
    RepeaterSetItemClass: function (class1, class2, hoverClass) {//行样式
        this.each(function () {
            if (class1 == null || class2 == null || hoverClass == null)
                return;
            //将设置存入缓存
            $(this).data("_class1", class1);
            $(this).data("_class2", class2);
            $(this).data("_hoverClass", hoverClass);
            //
            if ($(this).data("_DataSrc") != null) {
                var domtype = $(this).find(".itemtemplate").attr('nodeName');
                //
                $(this).find(domtype).addClass(class1);
                $(this).find(domtype + ":nth-child(even)").addClass(class2);
                // $(this).find(domtype+":first").removeClass(class1);
                //鼠标移动上去颜色变化 
                $(this).find(domtype).hover(function () {
                    $(this).addClass(hoverClass);
                }, function () {
                    $(this).removeClass(hoverClass);
                });
            }
        });
    },
    toHTML: function () {//取自身HTML源码的插件.
        var obj = $(this[0]);
        if (obj[0].outerHTML) {
            return obj[0].outerHTML;
        }
        else {
            if ($('.dc_hidearea') == null || $('.dc_hidearea')[0] == null) {
                $('body').append("<div class='dc_hidearea' style='display:none;'></div>");
            }
            $('.dc_hidearea').css('display', 'none');
            $('.dc_hidearea').html('');
            obj.clone(true).prependTo('.dc_hidearea');
            var rs = $('.dc_hidearea').html();
            $('.dc_hidearea').html('');
            return rs;
        }
    }
});

//查找字段公共方法.
function ____FindFiled(str) {//公共方法.
    var myRegex = new RegExp("\{.+?\}", "gim");
    //var arr = myRegex.exec(str);
    var arr = str.match(myRegex);
    if (arr == null) return null;
    var count = arr.length;
    for (var i = 0; i < count; i++) {
        arr[i] = arr[i].Replace("{", "").Replace("}", "");
    }
    return arr;
}
function outerHTML($obj) {
    var obj = ($obj[0]);
    if (obj.outerHTML) {
        return obj.outerHTML;
    }
    else {
        if ($('.dc_hidearea') == null || $('.dc_hidearea')[0] == null) {
            $('body').append("<div class='dc_hidearea' style='display:none;'></div>");
        }
        $('.dc_hidearea').css('display', 'none');
        $('.dc_hidearea').html('');
        obj.clone(true).prependTo('.dc_hidearea');
        var rs = $('.dc_hidearea').html();
        $('.dc_hidearea').html('');
        return rs;
    }

}

function extendPagination(obj, options) {
    var defaults = {
        //pageId:'',
        totalCount: '',
        showPage: '10',
        limit: '5',
        callback: function () {
            return false;
        }
    };

    $.extend(defaults, options || {});
    if (options.totalCount == '') {
        obj.empty();
        return false;
    } else if (Number(options.totalCount) <= 0) {
        obj.empty();
        return false;
    }
    //if (defaults.showPage == '') {
    //    defaults.showPage = '10';
    //} else if (Number(defaults.showPage) <= 0) defaults.showPage = '10';
    //if (defaults.limit == '') {
    //    defaults.limit = '5';
    //} else if (Number(defaults.limit) <= 0) defaults.limit = '5';
    var totalCount = Number(options.totalCount), showPage = Number(options.showPage),
        limit = Number(options.limit), totalPage = Math.ceil(totalCount / limit);
    if (totalPage > 0) {
        var html = [];
        html.push(' <ul class="pagination">');
        html.push(' <li class="previous"><a href="#">&laquo;</a></li>');
        html.push('<li class="disabled hidden"><a href="#">...</a></li>');
        if (totalPage < showPage) {
            for (var i = 1; i <= totalPage; i++) {
                if (i == 1) html.push(' <li class="active"><a href="#">' + i + '</a></li>');
                else html.push(' <li><a href="#">' + i + '</a></li>');
            }
        } else {
            for (var j = 1; j <= showPage; j++) {
                if (j == 1) html.push(' <li class="active"><a href="#">' + j + '</a></li>');
                else html.push(' <li><a href="#">' + j + '</a></li>');
            }
        }
        html.push('<li class="disabled hidden"><a href="#">...</a></li>');
        html.push('<li class="next"><a href="#">&raquo;</a></li></ul>');
        obj.html(html.join(''));
        if (totalPage > showPage) obj.find('ul.pagination li.next').prev().removeClass('hidden');

        var pageObj = obj.find('ul.pagination'), preObj = pageObj.find('li.previous'),
            currentObj = pageObj.find('li').not('.previous,.disabled,.next'),
            nextObj = pageObj.find('li.next');

        function loopPageElement(minPage, maxPage) {
            var tempObj = preObj.next();
            for (var i = minPage; i <= maxPage; i++) {
                if (minPage == 1 && (preObj.next().attr('class').indexOf('hidden')) < 0)
                    preObj.next().addClass('hidden');
                else if (minPage > 1 && (preObj.next().attr('class').indexOf('hidden')) > 0)
                    preObj.next().removeClass('hidden');
                if (maxPage == totalPage && (nextObj.prev().attr('class').indexOf('hidden')) < 0)
                    nextObj.prev().addClass('hidden');
                else if (maxPage < totalPage && (nextObj.prev().attr('class').indexOf('hidden')) > 0)
                    nextObj.prev().removeClass('hidden');
                var obj = tempObj.next().find('a');
                if (!isNaN(obj.html())) obj.html(i);
                tempObj = tempObj.next();
            }
        }

        function callBack(curr) {
            defaults.callback(curr, defaults.limit, totalCount);
        }

        currentObj.on("click", function (event) {
            container.hide();
            $("#myModal").show();
            event.preventDefault();
            var currPage = Number($(this).find('a').html()), activeObj = pageObj.find('li[class="active"]'),
                activePage = Number(activeObj.find('a').html());
            if (currPage == activePage) return false;
            callbacknew(currPage);

            if (totalPage > showPage) {
                var maxPage = currPage, minPage = 1;
                if (($(this).prev().attr('class'))
                    && ($(this).prev().attr('class').indexOf('disabled')) >= 0) {
                    minPage = currPage - 1;
                    maxPage = minPage + showPage - 1;
                    loopPageElement(minPage, maxPage);
                } else if (($(this).next().attr('class'))
                    && (obj.next().attr('class')!=undefined && obj.next().attr('class').indexOf('disabled')) >= 0) {
                    if (totalPage - currPage >= 1) maxPage = currPage + 1;
                    else maxPage = totalPage;
                    if (maxPage - showPage > 0) minPage = (maxPage - showPage) + 1;
                    loopPageElement(minPage, maxPage)
                }
            }
            activeObj.removeClass('active');
            $.each(currentObj, function (index, thiz) {

                if ($(thiz).find('a').html() == currPage) {
                    $(thiz).addClass('active');
                }
            });
        });
        preObj.on('click', function (event) {
            event.preventDefault();

            var activeObj = pageObj.find('li[class="active"]'), activePage = Number(activeObj.find('a').html());
            if (activePage <= 1) return false;
            if (totalPage > showPage) {
                var maxPage = activePage, minPage = 1;
                if ((activeObj.prev().prev().attr('class'))
                    && (activeObj.prev().prev().attr('class').indexOf('disabled')) >= 0) {
                    minPage = activePage - 1;
                    if (minPage > 1) minPage = minPage - 1;
                    maxPage = minPage + showPage - 1;
                    loopPageElement(minPage, maxPage);
                }
            }
            $.each(currentObj, function (index, thiz) {
                if ($(thiz).find('a').html() == (activePage - 1)) {
                    activeObj.removeClass('active');
                    $(thiz).addClass('active');
                    callBack(activePage - 1);
                }
            });
        });
        nextObj.click(function (event) {
            event.preventDefault();
            var activeObj = pageObj.find('li[class="active"]'), activePage = Number(activeObj.find('a').html());
            if (activePage >= totalPage) return false;
            if (totalPage > showPage) {
                var maxPage = activePage, minPage = 1;
                if ((activeObj.next().next().attr('class'))
                    && (activeObj.next().next().attr('class').indexOf('disabled')) >= 0) {
                    maxPage = activePage + 2;
                    if (maxPage > totalPage) maxPage = totalPage;
                    minPage = maxPage - showPage + 1;
                    loopPageElement(minPage, maxPage);
                }
            }
            $.each(currentObj, function (index, thiz) {
                if ($(thiz).find('a').html() == (activePage + 1)) {
                    activeObj.removeClass('active');
                    $(thiz).addClass('active');
                    callBack(activePage + 1);
                }
            });
        });
    }
}

function DataBind(container, val, ItemCreatedCallBack) {
    container.each(function () {
        if (val == null || val == undefined) {//如果参与为空返回相应数据
            return container.data("_DataSrc");//从缓存返回数据
        }
        else {//如果不为空设置数据源。
            //
            try {
                var valtype = (typeof val).toString();
                if (valtype == 'string')
                    //            val =jsonStringToDataTable(val).rows;
                    val = jsonStringToDataTable(val);
            } catch (ex) {
                alert(ex);
                return;
            }
            //
            var domtype = container.find(".itemtemplate").attr('nodeName');//查找元素类型
            if (container.data("_ItemTemplate") == null) {
                container.data("_ItemTemplate", outerHTML(container.find(".itemtemplate")));
                container.find(".itemtemplate").remove();
            }
            var TrContentTemplate = container.data("_ItemTemplate");
            var fileds = ____FindFiled(TrContentTemplate);//找到所有列
            if (fileds == null) return false;
            var filedscount = fileds.length;//计算列数
            ////
            count = val.length;
            container.data("_DataSrc", val); //将数据放入缓存
            //清空原有数据
            var area = container.find('tbody');
            if (area == null || area.size() == 0) {
                area = container;
            }

            area.empty();
            for (var i = 0; i < count; i++) {
                ////绑定列值
                var NewTrContent = TrContentTemplate;
                //
                NewTrContent = NewTrContent.Replace("{{", "{#");
                NewTrContent = NewTrContent.Replace("}}", "#}");
                for (var j = 0; j < filedscount; j++) {
                    NewTrContent = NewTrContent.Replace("{" + fileds[j] + "}", val[i][fileds[j].trim()]);
                }
                NewTrContent = NewTrContent.Replace("{#", "{");
                NewTrContent = NewTrContent.Replace("#}", "}");
                //
                var area = container.find('tbody');
                if (area == null || area.size() == 0)
                    area = container;
                area.append(NewTrContent);
                //if (ItemCreatedCallBack != null) {
                //    ItemCreatedCallBack(container.find(domtype + ":last"));
                //}
            }
            //
            // $(this).RepeaterSetItemClass($(this).data("_class1"), $(this).data("_class2"), $(this).data("_hoverClass"));
        }
    });
}

//显示指定页的内容
function showPage(container, url, pageno, pagesize, ItemCreated, firstcall) {
    container.hide();
    //    window.scrollTo(0, container.offset().top - 20);
    $.ajax({
        type: "get",
        url: url,
        async: true,
        dataType: "text",
        data: { 'pagesize': pagesize, 'pageno': pageno },
        success: function (data) {
            totalCount = jsonStringToDataTable(data).totalCount;
            val = jsonStringToDataTable(data).elist;
            showCount = Math.ceil(parseInt(totalCount) * 1.0 / pagesize); //分页栏展示数

            
            if (pagesize >= totalCount) {
                $('#callBackPager').hide();
                firstcall = false;
            }

            else {
                $('#callBackPager').show();
                if (firstcall) {
                    extendPagination($('#callBackPager'), {
                        totalCount: totalCount,
                        showPage: 10,
                        limit: limit,
                        callback: function (curr, limit, totalCount) {
                            container.hide();
                            $("#myModal").show();
                            showPage(container, url_loaddata, curr, limit, ItemCreatedCallBack, false);
                        }
                    });

                }
            }
            DataBind(container, val, ItemCreated);
            container.show();
            $("#myModal").hide();

        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("出现错误:" + textStatus);
        }
    });
}

function callbacknew(curr) {

    container.hide();
    $("#myModal").show();

    setTimeout(_showPage(container, URL_loaddata, curr, _limit), 100);
}

function _showPage(container, URL_loaddata, curr, _limit) {
    return function () {
        showPage(container, URL_loaddata, curr, _limit, false);
    }
}
