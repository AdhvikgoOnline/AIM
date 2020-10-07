toastr.options = { "closeButton": true, "debug": false, "newestOnTop": false, "progressBar": true, "positionClass": "toast-top-center", "preventDuplicates": false, "onclick": null, "showDuration": "300", "hideDuration": "1000", "timeOut": "7000", "extendedTimeOut": "1000", "showEasing": "swing", "hideEasing": "linear", "showMethod": "fadeIn", "hideMethod": "fadeOut" };
var aifc = 'main'; var fromlink = /[`~!@#$%^&*()|+-=?;:'",.<>{}[]\/\s]/gi;
var actbtn = '<button type="button" data-value="2" class=""><i class="fa fa-edit" title="Edit"></i></button><button type="submit" data-value="3" class="w3-button w3-red w3-padding-small"><i class="far fa-trash-alt" title="Delete"></i></button>';
var savedRange, isInFocus, aizoomsrc, aizoomobj;
//loadScript("assets/toastr.min.css", function () {
//    loadScript("assets/toastr.min.js", function () {
//    });
//});
function imgError(t) { t.src = "img/aim.png" }
$(function () {
    try {
        $.get(API1 + 'gethtml/g/GAnalytics', function(d) {
            $('head').append(d.replace(/_gaid_/g, (typeof gaid == "undefined" ? 'UA-112112940-1' : gaid)));        /* code */
        }); 
    } catch (e) {}

    $.ajaxSetup({
        error: function (xhr, status, error) {
            //toastr["error"]("An AJAX error occured: " + status + "\nError: " + error);
            console.log("An AJAX error occured: " + status + "\nError: " + error);
        }
    });
    $.ajax({url:API1 + 'getcodefile/9996', type:'get',async:false,success:function(data) {$('body').append(data); } });
    $('#sitetmpl').load(cc + '/sitetmpl.html');
    //$('main').load(API1 + '../sg/a/Account0002.html #td00002');
    //$.ajax({url: API1 + '../sg/a/Account0002.html', dataType: 'text',success: function(result) { $('main').append(result); } });
    //$.get(API1 + 'getcodefile/9996', function (data) { $('body').append(data); });
    $('img').on("error", function () { this.src = "img/aim.png"; });

    $('body').off('click', '.action :submit').on('click', '.action :submit', function (e) {
        $t = $(this); $f = $('#' + $t.attr('form'));  dd = $t.data(); df = $f.data();
        if ($(':invalid', $f).length > 0) return;
        //try { tinyMCE.triggerSave(); } catch (ex) { }
        try { eval(aifun($f) + 'BeforeSubmit($f);'); } catch (e) { console.log(e.stack); }
        try { if (dd.beforesubmit != undefined) { eval(dd.beforesubmit + '($f);'); } } catch (e) { console.log(e.stack); }
        var prm = { d: dd, f: df, w: $f.serialize() };
        var sname = unstr(dd.service).length > 0 ? dd.service : 'crud';
        $.ajax({
            type: "POST", url: "aim.asmx/" + sname, data: prm, dataType: 'text', async: false, success: function (data) {
                var $c = ($t.closest('.aibcontent') == undefined || $t.closest('.aibcontent').length == 0) ? $t.closest('.aimodal') : $t.closest('.aibcontent');
                if (sname == 'ForgotPassword') { alert(data); $('button[value=closeform]', $c).trigger('click'); return; }
                if (data == "login required") { $('.nouser').trigger('click'); return; }
                dt = JSON.parse(data);
                if (sname == 'CheckLogin') udt = dt;
                var successmsg = "";
                var dcont = $f.closest('.aibcontent').data();
                if (dcont == undefined) dcont = $f.closest('.aimodal').data();
                if (dcont.submitmessage == undefined) successmsg = dt.msg;
                else if (dcont.submitmessage.length > 0) successmsg = dcont.submitmessage;
                else successmsg = dt.msg;
                if (data != '0') { toastr["success"](successmsg); } else { toastr["error"]("Failure! May try again ..."); }
                bsuccess = true;
                try { eval(aifun($f) + 'AfterSubmit(JSON.parse(data));'); } catch (e) { console.log(e.stack); }
                try { if(dcont.aftersubmit != undefined) eval(dcont.aftersubmit + '(data);'); } catch (e) { console.log(e.stack); }

                if (dcont.closeonsubmit == "1") { $c.after("<p class='aigreen aipa32 aiacenter'>" + successmsg + "</p>"); $('button[value=closeform]', $c).trigger('click');  }
                if ($c.data('formview') == "6" || $c.data('formview') == "4") {
                    $('.ahaction button[value=showlist]', $c).trigger('click');
                }
                $('button.srefresh', $c).trigger('click');

                //if (unbool(dd.submitreset)) {
                if (dd.submitreset == undefined) {
                    $t.next(':reset').trigger('click');
                    $('.aiedit', $f).html('');
                    try { eval(aifun($f) + 'Reset();'); } catch (e) { console.log(e.stack); }
                    $('[autofocus=autofocus]', $f).focus();
                }
            },
            error: function () { toastr["error"]("Failure! May try again ..."); bsuccess = false; }
        });
        e.preventDefault();
    });

    $(document).on('hover', 'input,select,textarea', function (e) {
        if (uuid == '101') {
            var ptitle = $(this).attr('title');
            if(e.type == "mouseenter") {
                $(this).attr('title', $(this).attr('name'));
            }
            else if (e.type == "mouseleave") {
                $(this).attr('title', ptitle);
            }
        }
    });
    $(document).on('focus', 'input:not([type=checkbox], [type=radio]),select,textarea', function (e) {
      $(this).closest("div").addClass('inputdiv');
    });
    $(document).on('focusout', 'input:not([type=checkbox], [type=radio]),select,textarea', function (e) {
      $(this).closest("div").removeClass('inputdiv');
    });
    // on first focus (bubbles up to document), open the menu
    $(document).on('focus', '.select2-selection.select2-selection--single', function (e) {
      $(this).closest(".select2-container").siblings('select:enabled').select2('open');
    });
    
    // steal focus during close - only capture once and stop propogation
    $('select.select2').on('select2:closing', function (e) {
      $(e.target).data("select2").$selection.one('focus focusin', function (e) {
        e.stopPropagation();
      });
    });    

    $('body').off('error', 'img').on('error', 'img', function () { $(this).attr('src', 'img/aim.png'); });
    $('.loadpage').each(function () { loadPage($(this)); });
    $('body').off('click', '#openpanels a:not([href]), aside.l a:not([href]), .opensubform, .openform').on('click', '#openpanels a:not([href]), aside.l a:not([href]), .opensubform, .openform', function () {
        if ($(this).hasClass('accordionsnd')) { $(this).toggleClass('accordionopen'); $(this).next('div').slideToggle(); } else {
            var fid = $(this).data('menu').split('`')[0]; if(ismobile) $('header .bars8').trigger('click');
            $('#openpanels a, aside.l a').removeClass('active'); $(this).addClass('active'); $('#openpanels a[data-menu^=' + fid + ']').addClass('active');
            if ($('#AC' + fid).html()) {
                $('.aibcontent:not(:hidden)', cntr).hide(); $('#AC' + fid).show(); $('main').scrollTop(); 
                $('input[autofocus=autofocus]', '#AC' + fid).focus();
            } else {
                loadPage($(this));
            }
        };
    });
    $('body').off('click', '.alaction button').on('click', '.alaction button', function (e) {
        var $c = $(this).closest('.aibcontent') == undefined || $(this).closest('.aibcontent').length == 0 ? $(this).closest('.aimodal') : $(this).closest('.aibcontent');
        v = $(this).val(); v1 = $(this).data('value'); $t = $(this).closest('table'); if($t.length <= 0) $t = $(this).closest('.aimtable'); vi = $(this).index('#' + $t.attr('id') + ' [data-value=' + v1 + ']');
        var data = $t.closest('div').data('dbrow').data[vi]; var dd = $t.data(); var ddf = $('form', $c).data(); var dbd = $(this).data(); $r = $(this).closest('tr');
        //var data = $t.DataTable().row($(this).parents('tr')).data();
        if (v1 == 2) {
            var $f = $(this).closest('.aibcontent') == undefined || $(this).closest('.aibcontent').length == 0 ? $(this).closest('.aimodal') : $(this).closest('.aibcontent');
            if ($c.data('formview') == "4" || $c.data('formview') == "6") {
                $('.ahaction button[value=showentry]', $f).trigger('click');
            }
            SetToInput($('#' + dd.showform), data, ''); $('[autofocus=autofocus]', '#' + dd.showform).focus();
        }
        else if (v1 == 3) {
            dcon = confirm("Willing to delete the record ?"); if (dcon) {
                var prm = { d: dbd, f: $.extend({}, dd, ddf), w: jQuery.param(data) };
                $.ajax({
                    type: "POST", url: "aim.asmx/crud", data: prm, dataType: 'text', async: false, success: function (data) {
                        dt = JSON.parse(data);
                        if (data != '0') { toastr["success"](dt.msg); /*$r.remove();*/ $('button.srefresh', $c).trigger('click'); } else { toastr["error"]("Failure! May try again ..."); }
                    },
                    error: function () { toastr["error"]("Failure! May try again ..."); bsuccess = false; }
                });
            }
        }
        //alert(data.Companyid + "'s salary is: " + data.GTitle);
    });
    $('body').off('click', '.ahaction :button').on('click', '.ahaction :button', function (e) {
        $b = $(this); $c = $b.closest('.aibcontent'); if ($c.length <= 0) $c = $b.closest('.aimodal'); $f = $('#' + $c.attr('id').replace('AC','F00'));
        switch ($(this).val()) {
            case 'addrecord': 
                $('.aientry, .aicontrollers', $c).show();
                $('.aishown', $c).hide();
                $(':reset',$c).trigger('click'); $('.aiedit', $f).html(''); try { eval(aifun($f) + 'Reset();'); } catch (e) { console.log(e.stack); }
                $('[autofocus=autofocus]', $f).focus(); break;
            case 'prevrecord': eval($c.data('prev')); break;
            case 'nextrecord': eval($c.data('next')); break;
            case 'closeform':
                if ($c.hasClass('aimodal')) { $c.remove(); } else {
                    $c.remove(); $('.aibcontent:last', aifc).show();
                }
                try { eval(aifun($f) + 'Close();'); } catch (e) { console.log(e.stack); }
                break;
            case 'showhidden':
                if ($('.aihide', $c).length > 0) { $('.aihide', $c).addClass('aihides ailightgray').removeClass('aihide'); } else
                { $('.aihides', $c).removeClass('aihides ailightgray').addClass('aihide'); } break;
            case 'showentry':
                $('.aientry, .aicontrollers', $c).show();
                $('.aishown', $c).hide();
                $('[autofocus=autofocus]', $f).focus(); break;
                break;
            case 'showlist':
                $('.aientry, .aicontrollers', $c).hide();
                $('.aishown', $c).show()
                break;
            case 'showlistentry':
                $('.aientry, .aicontrollers, .aishown', $c).show();
                break;
        }
    });
    //$('body').off('click', '.tabs a, .tabs button').on('click', '.tabs a, .tabs button', function (e) {
    //    e.preventDefault();
    //    $c = $(this).closest('.tabs'); p = $c.data('tabpan'); $('#' + p + ' > div').addClass('aihide'); $('#' + p + ' > div:eq(' + $(this).index() + ')').toggleClass('aihide');
    //    //var tc = $(this).data("click"); if(tc != undefined) { eval(tc + "(" + $(this).index() + ");") }
    //});
    //$('body').off('mouseenter', '.tabshover a, .tabshover button').on('mouseenter', '.tabshover a, .tabshover button', function (e) {
    //    e.preventDefault();
    //    $c = $(this).closest('.tabshover'); p = $c.data('tabpan'); $('#' + p + ' > div').addClass('aihide'); $('#' + p + ' > div:eq(' + $(this).index() + ')').toggleClass('aihide');
    //    //var tc = $(this).data("click"); if(tc != undefined) { eval(tc + "(" + $(this).index() + ");") }
    //});
    $('body').off('click', '.airemoveimg').on('click', '.airemoveimg', function (e) {
        $inpt = $("input", $(this).parents('.images').parents('div')[0]);
        i1 = $('.airemoveimg', $(this).closest('.images')).index($(this));
        ainpt = $inpt.val().split(','); ainpt.splice(i1, 1);
        vinpt = ainpt.join(',');
        $inpt.val(vinpt);
        $(this).closest('.aidc').remove();
    });
    $('body').off('click', '.w3-zoomimg').on('click', '.w3-zoomimg', function (e) {
        //$inpt = $("input", $(this).closest('.w3-col'));
        tmp = $(this).closest('.aibcontentimg').find('img').attr('src');
        $('#zoomimg img').attr('src', tmp.replace('--100.', '.'));
        $('#zoomimg').css('display', 'block');
    });
    $("body").off('click', '.ai-tabs button, .ai-tabs a').on('click', '.ai-tabs button, .ai-tabs a', function (e) {
        alltabs($(this), e);
    });
    $("body").off('mouseenter', '.ai-tabshover button, .ai-tabshover a').on('mouseenter', '.ai-tabshover button, .ai-tabshover a', function (e) {
        alltabs($(this), e);
    });
    function alltabs($t, $e) {
        $e.preventDefault();
        var $c = $t.closest('div'); var $a = $c.data('active'); var d = $c.data("tabs");
        var t = $t.index();
        $("button, a", $c).removeClass($a);
        $t.addClass($a);
        var $d = $("#" + d + " > div");
        $d.addClass("aihide");
        if ($t.closest('.w3-dropdown-content') != undefined) {
            var nn = $d.length / 2;
            $d.eq(t).removeClass("aihide");
            //$d.eq(t+nn).removeClass("aihide");
        }
        try {
            eval($c.data('callback') + '($c,$t,t,$d)');
        } catch (e) {

        }
    }
    $('body').off('click', ':reset').on('click', ':reset', function (e) {
        $t = $(this); $f = $('#' + $t.attr('form')); $('.images', $f).html(''); $('.mddl', $f).each(function() { $(this).val([]); $(this).trigger('change'); });$('.ddl', $f).each(function() { $(this).val(''); $(this).trigger('change');});
        $('input[autofocus=autofocus]', $f).focus();
    });
    //$('body').off('click', '.fa-copy').on('click', '.fa-copy', function (e) {
    //    $(this).next('input').val($(this).next('input').data("oldval"));
    //});
    //$('body').off('change', 'input').on('change', 'input', function (e) {
    //    $(this).data("oldval", $(this).val());
    //});
    $(document.body).off('click', '.aitoolbar:not(.ahaction) button').on('click', '.aitoolbar:not(.ahaction) button', function (e) {
        e.preventDefault();
        var dparent = $(this).closest('.aitoolbar'); var $obj = $(this); var cpg = eval($('.sstart', dparent).val()); var mpg = $('.sstart', dparent).attr('max');
        if ($obj.hasClass('sprev')) { $('.sstart', dparent).val((cpg - 1) <= 0 ? 1 : cpg - 1); }
        else if ($obj.hasClass('snext')) { $('.sstart', dparent).val((cpg + 1) > mpg ? mpg : cpg + 1); }
        else if ($obj.hasClass('sfirst')) { $('.sstart', dparent).val(1); }
        else if ($obj.hasClass('slast')) { $('.sstart', dparent).val(mpg); }
        //$('.sstart', dparent).trigger('change');
        if (dparent.data("function") == undefined) {
            //loadtable($('#' + $(this).closest('table').attr('id')));
            loadtable($('#' + dparent.attr('id').replace('ct', 'tb')));
        } else {
            eval(dparent.data("function"));
        }
    });
    $(document.body).off('blur', '.aitoolbar .ssearch, .aitoolbar .sstart, .aitoolbar .slength').on('blur', '.aitoolbar .ssearch, .aitoolbar .sstart, .aitoolbar .slength', function () {
        var dparent = $(this).closest('nav'); $('.srefresh', dparent).trigger('click');
    });
    $(document.body).off('change', '.aitoolbar .slength').on('change', '.aitoolbar .slength', function () {
        var dparent = $(this).closest('nav'); $('.srefresh', dparent).trigger('click');
    });

    $(document.body).off('click', '.aitoolbar1 button').on('click', '.aitoolbar1 button', function () {

        var dparent = $(this).closest('div'); var $obj = $(this); var cpg = eval($('.sstart1', dparent).val()); var mpg = $('.maxpages', $('#' + dparent.data('grid'))).text();
        if ($obj.hasClass('sprev1')) { cpg = (cpg - 1) <= 0 ? 1 : cpg - 1; $('.sstart1', dparent).val(cpg); }
        else if ($obj.hasClass('snext1')) { cpg = (cpg + 1) > mpg ? mpg : cpg + 1; $('.sstart1', dparent).val(cpg); }
        else if ($obj.hasClass('sfirst1')) { cpg = 1; $('.sstart1', dparent).val(cpg); }
        else if ($obj.hasClass('slast1')) { cpg = mpg; $('.sstart1', dparent).val(cpg); }
        //$('.sstart', dparent).trigger('change');
        var ssearch = $('.ssearch1', dparent).val()
        window.location = dparent.data('link') + "?q1=" + eval(cpg - 1).toString() + (ssearch.length > 0 ? "&q2=" + ssearch : "");
        //loadtable($('#' + dparent.attr('id').replace('ct', 'tb')));
    });
    $(document.body).off('blur', '.aitoolbar1 .ssearch1').on('blur', '.aitoolbar1 .ssearch1', function () {
        var dparent = $(this).closest('div'); $('.srefresh1', dparent).trigger('click');
        //var ssearch = $('.ssearch1', dparent).val()
        //window.location = dparent.data('link') + "?q1=" + eval(cpg - 1).toString() + ssearch.length > 0 ? "&q2=" + ssearch : "";
    });
    $(document.body).off('click', '.aitoolbar2 button').on('click', '.aitoolbar2 button', function () {
        var dparent = $(this).closest('.ai-page'); var $obj = $(this); var cpg = eval($('.mdl', dparent).data('pg'));
        var mpg = $('.maxpages', dparent).text();
        if ($obj.hasClass('sprev2')) { cpg = (cpg - 1) < 0 ? 0 : cpg - 1; $('.mdl', dparent).data('pg', cpg); }
        else if ($obj.hasClass('snext2')) { cpg = (cpg + 1) > (mpg - 1) ? (mpg - 1) : cpg + 1; $('.mdl', dparent).data('pg', cpg); }
        //else if ($obj.hasClass('sfirst2')) { cpg = 1; $('.sstart2', dparent).val(cpg); }
        //else if ($obj.hasClass('slast2')) { cpg = mpg; $('.sstart2', dparent).val(cpg); }
        var ssearch = $('.ssearch2', dparent).val()
        //window.location = dparent.data('link') + "?q1=" + eval(cpg - 1).toString() + (ssearch.length > 0 ? "&q2=" + ssearch : "");
        cobj = $('.mdl', dparent);
        $.ajax({
            type: 'POST', cache: false, async: false, url: 'aim.asmx/ShowMdl', data: { 's': cobj.data("page"), 'pg': cobj.data('pg') }, success: function (d) {
                cobj.html(d); aiLazy(cobj);
                cobj.attr("loaded", true);
            }
        });
    });
    $(document.body).off('blur', '.aitoolbar2 .ssearch2').on('blur', '.aitoolbar2 .ssearch2', function () {
        var dparent = $(this).closest('div'); $('.srefresh2', dparent).trigger('click');
        //var ssearch = $('.ssearch1', dparent).val()
        //window.location = dparent.data('link') + "?q1=" + eval(cpg - 1).toString() + ssearch.length > 0 ? "&q2=" + ssearch : "";
    });
    $(document.body).off('click', '.aizoom img').on('click', '.aizoom img', function (e) {
        e.preventDefault();
        var dparent = $(this).closest('div.aizoom'); aizoomobj = $(this); aizoomsrc = $(this).attr('src'); loadPage(dparent);
    });

    $(document.body).off('click', '.ai-pagetools button').on('click', '.ai-pagetools button', function () {
        var dparent = $(this).closest('.ai-page'); var $obj = $(this), $pginfo = $('.ai-pagegrid div.pginfo:last', dparent); var cpg = eval($('.curpage', $pginfo).text());
        var mpg = $('.maxpages', $pginfo).text();
        if ($obj.hasClass('sprev')) { cpg = (cpg - 1) < 0 ? 0 : cpg - 1; $('.ai-pagegrid', dparent).data('pg', cpg); }
        else if ($obj.hasClass('snext')) { cpg = (cpg + 1) > (mpg - 1) ? (mpg - 1) : cpg + 1; $('.ai-pagegrid', dparent).data('pg', cpg); }
        //else if ($obj.hasClass('sfirst2')) { cpg = 1; $('.sstart2', dparent).val(cpg); }
        //else if ($obj.hasClass('slast2')) { cpg = mpg; $('.sstart2', dparent).val(cpg); }
        var ssearch = $('.ssearch', dparent).val();
        window.location = window.location.origin + window.location.pathname + "?q1=" + eval(cpg).toString() + (ssearch == undefined ? "" : (ssearch.length > 0 ? "&q2=" + ssearch : ""));
    });

        /* start Editor */
    //$('.aiedit', $('.editor').closest('.aieditor')).css('height', $('.editor').height());
    $(document).off('focusout', '.aiedit').on('focusout', '.aiedit', function () {
        $('.editor', $(this).closest('.aieditor')).val($(this).html());
    });
    $(document).off('focusout', '.editor').on('focusout', '.editor', function () {
        $('.aiedit', $(this).closest('.aieditor')).html($(this).val());
    });
    $(document).off('mouseup touchend keyup', '.aiedit').on("mouseup touchend keyup", '.aiedit', function (e) {
        if (window.getSelection().focusNode != null) {
            /*$('.divsel').removeClass('divsel');
            selectedElement = window.getSelection().focusNode.parentNode;
            //debugger;
            if (selectedElement.tagName == "DIV")
                $(selectedElement).addClass('divsel');
            else if (selectedElement.tagName == "TD")
                $(selectedElement).closest('table').addClass('divsel');
            else if (selectedElement.tagName == "LI")
                $(selectedElement).closest('ul').addClass('divsel');
            else
                $(selectedElement).closest('div').addClass('divsel');*/
        }
    });
    // Paste fix for contenteditable
    $(document).off('paste', '.aiedit').on('paste', '.aiedit', function (e) {
        e.preventDefault();
    
        if (window.clipboardData) {
            content = window.clipboardData.getData('Text');        
            if (window.getSelection) {
                var selObj = window.getSelection();
                var selRange = selObj.getRangeAt(0);
                selRange.deleteContents();                
                selRange.insertNode(document.createTextNode(content));
            }
        } else if (e.originalEvent.clipboardData) {
            content = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand('insertText', false, content);
        }        
    });
    $(document).off('click', '.aiedit img').on('click', '.aiedit img', function () { $(this).addClass('divsel'); alert($(this).attr('src')); });
    $(document).off('click', '.aieditor > .aitoolbar a:not(.opensubform)').on('click', '.aieditor > .aitoolbar a:not(.opensubform)', function (e) {
        var command = $(this).data('command'); var $c = $(this).closest('.aieditor');
        $('.editor:not(.aihide), .aiedit:not(.aihide)', $c).setfocus();
        //movetosavedrange();
        if (command == 'code') {
            $('.editor, .aiedit', $c).toggleClass('aihide'); $(this).toggleClass('active');
        } else if (' h1 h2 h3 h4 h5 h6 p table div section article '.indexOf(command) > 0) {
            document.execCommand('formatBlock', false, command);
        } else if (command == 'forecolor' || command == 'backcolor') {
            document.execCommand(command, false, $(this).data('value'));
        } else if (command == 'createlink' || command == 'insertimage') {
            url = prompt('Enter the link here: ', 'http:\/\/');
            document.execCommand(command, false, url);
        } else if (command == 'insertimg') {

        } else if (command == 'insertHTML') {
            document.execCommand(command, false, $('#tmplactbtn1').html());
        } else {
            document.execCommand(command, false, null);
        }
    });
    
    $(document).off('blur', '.aiedit').on('blur','.aiedit',function() {
        if(window.getSelection) { savedRange = window.getSelection().getRangeAt(0); }
        else if(document.selection) { savedRange = document.selection.createRange(); } 
        $(this).data('cursor', savedRange);
    });

    /* end editor */
    $(document.body).off('click', '.aitoolbar .barsh').on('click', '.aitoolbar .barsh', function () {
        $(this).toggleClass('barchange'); $('nav', $(this).closest('.aitoolbar')).slideToggle();
    });
    $(document.body).off('change', '.uploadimage').on('change', '.uploadimage', function () {
        var $c = $(this).closest('.aifile'); $('.aispin', $c).toggleClass('aihide'); odata = $(this).data();
        var file;
        if (file = this.files[0]) {
            var formData = new FormData();
            var ffile = this.files[0];
            formData.append('file', ffile);
            formData.append('p', ffile.name);
            formData.append('fp', odata.folder);
            formData.append('fn', ffile.name);
            formData.append('f', ffile.name);
            formData.append('s', odata.imagesize);
            $.ajax({
                type: 'post', url: 'HandlerImg.ashx', data: formData, success: function (data) {
                    if (data != '') {
                        ds = JSON.parse(data); $(odata.imageno).val(ds[0].id);
                        $('.images', $c).html("<img src='" + ds[0].location + "' class='' style='width:100px;' />")
                    } else { }
                    $('.aispin', $c).toggleClass('aihide');
                }, processData: false, contentType: false, error: function () { $('.aispin', $c).toggleClass('aihide'); toastr["error"]("Whoops something went wrong!"); }
            });
        }
    });
});
(function ($) {

    $.fn.setfocus = function () {
        $(this).focus(); savedRange1 = $(this).data('cursor');
        if (savedRange1 != null) {
            if (window.getSelection) { var s = window.getSelection();
                if (s.rangeCount > 0)
                    s.removeAllRanges();
                s.addRange(savedRange1);
            }
            else if (document.createRange) { window.getSelection().addRange(savedRange1); }
            else if (document.selection) { savedRange1.select(); }
        }
        return this;
    };

}(jQuery));

function movetosavedrange() {
    if (savedRange != null) {
        if (window.getSelection)//non IE and there is already a selection
        {
            var s = window.getSelection();
            if (s.rangeCount > 0)
                s.removeAllRanges();
            s.addRange(savedRange);
        }
        else if (document.createRange)//non IE and no selection
        {
            window.getSelection().addRange(savedRange);
        }
        else if (document.selection)//IE
        {
            savedRange.select();
        }
    }
}
//function w3_open() { if ($('#sidetoggle').is(':visible')) $('#aiSidebar, #myOverlay').toggle(); }
//function w3_close() { $('#aiSidebar, #myOverlay').hide(); }
function aifun(f) { return f[0].id.replace('F01', 'AF').replace('F00', 'AF'); }
function unstr(s) { if (s == undefined) return ''; else return s; }
function emstr(s,r) { if (s == '') return r; else return s; }
function unstrs(s,r) { if (s == undefined) return r; else return s; }
function unbool(s) { if (s == undefined) return false; else return eval(s); }
var headbutton = ["<li><button type='button' accesskey='p' value='prevrecord' title='Previous'><i class='fa fa-arrow-left'></i></button></li>"
, "<li><button type='button' accesskey='n' value='nextrecord' title='Next'><i class='fa fa-arrow-right'></i></button></li>"
, "<li><button type='button' accesskey='a' value='addrecord' title='Add new'><i class='fa fa-plus'></i></button></li>"
, "<li><button type='button' accesskey='e' value='showentry' title='Show Entry Form'><i class='fa fa-edit'></i></button></li>"
, "<li><button type='button' accesskey='l' value='showlist' title='Show List Only'><i class='fa fa-list'></i></button></li>"
, "<li><button type='button' accesskey='m' value='showlistentry' title='Show List and Entry Form'><i class='fa fa-list-alt'></i></button></li>"
, "<li><button type='button' accesskey='h' value='showhidden' title='Show hidden fields - _0_'><i class='fa fa-code'></i></button></li>"
, "<li><button type='button' accesskey='t' value='showtiny' title='Compress Form / Small control display'><i class='fa fa-compress'></i></button></li>"
, "<li><button type='button' accesskey='x' value='closeform' title='Close Form _0_'>✕</button></li>"];
// 0-id, 1-parent id, 2-condition, 3-title, 4-html, 5-form number -- old one
// New- 0-id, 1-parent id, 2-condition, 3-head buttons, 4-foot buttons, 5=form view, 6-close on submit,7-width for modal
function loadPage(ch) {
    ch.attr('disabled','disabled');
    $('body').append('<div class="aipa8 loadingpage aiblue" style="padding-left:10px;position:fixed;top:0;right:0;z-index:10;"><i class="fas fa-spinner fa-spin"></i></div>');
    if (ch.attr('href') != undefined) return;
    var dd = ch.data();
    if (ch[0].tagName == "DIV") dd.container = "#" + ch.attr('id');
    if (dd.menu == undefined) {
        try { dd.menu = $('#' + ch.closest('label').attr("for")).data('menu').replace(/-/g, '`'); } catch (e) { dd.menu = undefined; return; }
    }
    //cntr = (unstr(dd.container) == '') ? aifc : dd.container;
    var amenu = dd.menu.split('`');
    cntr = unstrs(dd.container, aifc);
    var fid = unstr(amenu[0]);
    var pid = 'AC' + fid;
    var shbtn = emstr(amenu[3],"001111111");
    var hbtn = "";
    headbutton.forEach(function (v, i) { if (shbtn.substr(i, 1) == "1") { if (i == 8) v = v.replace("_0_", fid); else if (i == 6) v = v.replace('_0_', amenu[2]); hbtn += v; } });
    $.get(API1 + (unstr(dd.html).length > 0 ? 'gethtml/' + unstr(dd.html) : 'getcodefile/' + fid), function (data) {
    //$.ajax({
    //    url: API1 + (unstr(dd.html).length > 0 ? 'gethtml/' + unstr(dd.html) : 'getcodefile/' + fid), type: "GET", dataType: "html", async: false, complete: function (req,err) {
    //    data = req.responseText;
        var htm = data.replace(/\[cpath\]/g, cc).replace(/\[ctitle\]/g, ct);
        var htmf = "";
        if (!ch.hasClass("opensubform")) {
            $('.aibcontent:not(:hidden)', cntr).hide();
            //htmf = "<div id='AC" + fid + "' data-pbutton='#" + ch.attr('id') + "' data-parent='AC' data-condition='" + amenu[2] + "' data-formview='" + (amenu[5] == '' ? '1' : amenu[5]) + "' data-submitmessage='" + (dd.submitmessage == undefined ? '' : dd.submitmessage) + "' data-closeonsubmit='" + amenu[6] + "' data-login='" + (dd.login == undefined ? '' : dd.login) + "'  data-aftersubmit='" + (dd.aftersubmit == undefined ? '' : dd.aftersubmit) + "' data-beforesubmit='" + (dd.beforesubmit == undefined ? '' : dd.beforesubmit) + "' class='aibcontent hdform'><div class='aitoolbarh aifhead ahaction aipr clearfix'> <div class='aimnavhead'><button type='button' value='closeform' class='aihlarge' title='Close Form'>✕</button> <div class='bars barsh'> <div class='bar1'></div> <div class='bar2'></div> <div class='bar3'></div> </div> <a class='ailogo'>" + ch.text() + "</a> </div> <nav> <div class='aimnavright'> <ul class='aimnavnav aiform'> <li><span class='custom-buttons'></span></li>" + hbtn + "</ul> </div> </nav> </div> <div class='aibcontent-body'>" + htm + "</div></div>";
            htmf = "<div id='AC" + fid + "' data-pbutton='#" + ch.attr('id') + "' data-parent='AC' data-condition='" + amenu[2] + "' data-formview='" + (amenu[5] == '' ? '0' : amenu[5]) + "' data-submitmessage='" + (dd.submitmessage == undefined ? '' : dd.submitmessage) + "' data-closeonsubmit='" + amenu[6] + "' data-login='" + (dd.login == undefined ? '' : dd.login) + "'  data-aftersubmit='" + (dd.aftersubmit == undefined ? '' : dd.aftersubmit) + "' data-beforesubmit='" + (dd.beforesubmit == undefined ? '' : dd.beforesubmit) + "' class='aibcontent hdform'><div class='aitoolbarh aifhead ahaction aipr clearfix'> <div class='aimnavhead'><a class='ailogo'>" + ch.text() + "</a> </div> <div class='aimnavright'> <ul class='aimnavnav aiform'> <li><span class='custom-buttons'></span></li>" + hbtn + "</ul> </div> </div> <div class='aibcontent-body'>" + htm + "</div></div>";
            $(cntr).append(htmf);
            if ($('#openpanels a[data-menu^=' + fid + ']').length <= 0) {
                $('#openpanels').append(ch[0].outerHTML); $('#openbadge').html($('#openpanels a').length);
            }
        } else {
            //htmf = "<div id='AC" + fid + "' data-pbutton='#" + ch.attr('id') + "' data-parent='AC" + amenu[1] + "' data-condition='" + amenu[2] + "' data-formview='" + (amenu[5] == '' ? '1' : amenu[5]) + "' data-submitmessage='" + (dd.submitmessage == undefined ? '' : dd.submitmessage) + "' data-closeonsubmit='" + amenu[6] + "' data-login='" + (dd.login == undefined ? '' : dd.login) + "'  data-aftersubmit='" + (dd.aftersubmit == undefined ? '' : dd.aftersubmit) + "' data-beforesubmit='" + (dd.beforesubmit == undefined ? '' : dd.beforesubmit) + "' class='aibcontent hdform aimodal " + (amenu[8] == '' ? '' : amenu[8]) + "' style='display:none;'><div style='width:" + (amenu[7] == '' ? '50%' : amenu[7]) + ";'><div class='aitoolbar aifhead ahaction aipr clearfix'> <div class='aimnavhead'> <button type='button' value='closeform' class='aihlarge' title='Close Form'>✕</button> <div class='bars barsh'> <div class='bar1'></div> <div class='bar2'></div> <div class='bar3'></div> </div> <a class='ailogo'>" + ch.text() + "</a> </div> <nav> <div class='aimnavright'> <ul class='aimnavnav aiform'> <li><span class='custom-buttons'></span></li>" + hbtn + "</ul> </div> </nav> </div> <div class='aibcontent-body'>" + htm + "</div></div></div>";
            htmf = "<div id='AC" + fid + "' data-pbutton='#" + ch.attr('id') + "' data-parent='AC" + amenu[1] + "' data-condition='" + amenu[2] + "' data-formview='" + (amenu[5] == '' ? '0' : amenu[5]) + "' data-submitmessage='" + (dd.submitmessage == undefined ? '' : dd.submitmessage) + "' data-closeonsubmit='" + amenu[6] + "' data-login='" + (dd.login == undefined ? '' : dd.login) + "'  data-aftersubmit='" + (dd.aftersubmit == undefined ? '' : dd.aftersubmit) + "' data-beforesubmit='" + (dd.beforesubmit == undefined ? '' : dd.beforesubmit) + "' class='aibcontent hdform aimodal " + (amenu[8] == '' ? '' : amenu[8]) + "' style='display:none;'><div style='" + (ismobile ? 'width:100%;' : ';') + "width:" + (amenu[7] == '' ? '50%' : amenu[7]) + ";'><div class='aitoolbarh aifhead ahaction aipr clearfix'> <div class='aimnavhead'> <a class='ailogo'>" + ch.text() + "</a> </div> <div class='aimnavright'> <ul class='aimnavnav aiform'> <li><span class='custom-buttons'></span></li>" + hbtn + "</ul> </div> </div> <div class='aibcontent-body'>" + htm + "</div></div></div>";
            $('body').append(htmf);
            $('#' + pid).show();
        }

        GeneralCall('#F00' + fid);
        $('.toremove, .c-remove', '#' + pid).remove();
        var mf = $('#' + pid);
        if (mf.data('formview') == "6") {
            $('.aientry, .aicontrollers', mf).hide();
        } else if (mf.data('formview') == "4") {
            $('.aishown', mf).hide();
        } else if (mf.data('formview') == "1") {
            $('.aishown', mf).remove();
        }
        try { if(dd.afterload != undefined) eval(dd.afterload + '(mf);'); } catch (e) { console.log(e.stack); }
        ch.removeAttr('disabled');
        $('.loadingpage').remove();
        $('input[autofocus=autofocus]', '#' + pid).focus();
    //} 
    });
    if (uuid != '101') {
        $('.showhidden').remove();
    }
}
var tblcaption = "";
//var tblcaption = "<div class='select' style='width:71px;'><select class='slength'><option>10</option><option>20</option><option>50</option><option>100</option><option value='99999'>All</option></select>     <label>Pages</label> </div> <div style='width: 71px;'>     <input class='sstart' type='number' value='1' min='1' />     <label>Page</label> </div> <button class='sfirst'><i class='fa fa-angle-double-left'></i></button> <button class='sprev'><i class='fa fa-angle-left'></i></button> <button class='snext'><i class='fa fa-angle-right'></i></button> <button class='slast'><i class='fa fa-angle-double-right'></i></button> <label class='slabel'></label> <div style='width:160px;'>     <input type='text' class='ssearch' placeholder=' ' />     <label>Search</label> </div> <button class='srefresh'><i class='fa fa-sync'></i></button> <div class='scustom'></div> ";
function loadtable1(tb) {
    if (tb == undefined) return;
    dd = tb.data(); ddf = $('#' + dd.showform).data(); 
    ttm = tb.attr('id').replace('tb', 'tm'); var ttc = tb.attr('id').replace('tb', 'ct');
    if ($('#' + ttc).length == 0) {
        $(tb).closest('.aishown').prepend($('#tmplaishown').html().replace('ct0aaaa', ttc).replace(/aaaa/g,ttc));
    }
    if ($('#' + ttm).length == 0) {
        var scr = '<script id="' + ttm + '" type="x-tmpl-mustache">{{#data}}<tr class="dd-item">';
        ttr = "";
        $('thead th', tb).each(function (i) {
            sth = $(this).data('field'); scss = $(this).attr('class'); scnt = $(this).data('content');
            if (sth != undefined) { ttr += '<td class="' + scss + '">{{' + sth + '}}</td>'; } else {
                if (scnt != undefined) {
                    ttr += '<td class="' + scss + '">' + eval(scnt) + '</td>';
                }
            }
        });
        scr += ttr + '</tr>{{/data}}</script>';
        tb.closest('div').append(scr);
    }
    $.post('aim.asmx/dbLists1', { f: ddf, length: $('#' + ttc + ' .slength').val(), start: $('#' + ttc + ' .sstart').val() - 1, 'search[value]': $('#' + ttc + ' .ssearch').val() }, function (d) {
        //$.post('aim.asmx/dbLists1', { f: ddf }, function (d) {
        var template = $('#' + ttm).html(); var dt = JSON.parse(d)
        $('#' + ttc + ' .sstart').attr('max', dt.maxpages);
        var ss = eval($('#' + ttc + ' .sstart').val()); var sl = eval($('#' + ttc + ' .slength').val()); var sm = (((ss - 1) * sl) + sl);
        $('#' + ttc + ' .slabel').text((((ss - 1) * sl) + 1) + '-' + (sm <= dt.total ? sm : dt.total) + " of " + dt.total);
        var info = Mustache.render(template, dt);
        if($('tbody',tb).length > 0) $('tbody',tb).html(info); else $(tb).html(info); 
        tb.closest('div').data('dbrow', dt);
    });
}

var hlpfunctions = {'actbtn': function() { return  new Handlebars.SafeString('<button type="button" data-value="2" class=""><i class="fa fa-edit" title="Edit"></i></button><button type="submit" data-value="3" class="w3-button w3-red w3-padding-small"><i class="far fa-trash-alt" title="Delete"></i></button>')} 
, 'split': function(str, fmt) {
    var sstr = unstr(str).split(','); var ssstr = ""; var regex = new RegExp(fmt, "g");
    for(i=0;i<sstr.length;i++) ssstr += (sstr[i] == '' ? '' : fmt.replace(/{{this}}/g, sstr[i]).replace(/{{this1}}/g, btoa(sstr[i])));
    return new Handlebars.SafeString(ssstr);
}
, 'initl': function (str) { var inm = initl(str); return new Handlebars.SafeString(inm); }
, 'color1': function (str) { return new Handlebars.SafeString('<span style="background-color:' + str + ';height:22px;">&nbsp;&nbsp;</span>'); }
, 'html': function (str) { return new Handlebars.SafeString(str); }
};
function loadtable(tb) {
    if (tb == undefined) return;
    dd = tb.data(); ddf = $('#' + dd.showform).data(); 
    ttm = tb.attr('id').replace('tb', 'tm'); var ttc = tb.attr('id').replace('tb', 'ct');
    if ($('#' + ttc).length == 0) {
        $(tb).closest('.aishown').prepend($('#tmplaishown').html().replace('ct0aaaa', ttc).replace(/aaaa/g,ttc));
    }
    var hlppartials = {};
        
    
    if ($('#' + ttm).length == 0) {
        var scr = '<script id="' + ttm + '" type="text/x-handlebars-template">{{#data}}<tr>';
        ttr = "";
        $('thead th', tb).each(function (i) {
            sth = $(this).data('field'); scss = unstr($(this).attr('class')); scnt = $(this).data('content'); scss = (scnt == 'actbtn' ? "alaction " + scss : scss); sfmt = $(this).data('format');
            if (sth != undefined) { 
                if(sth.length > 5) { if(sth.substr(0,5) == 'split')
                        ttr += '<td class="' + scss + '">{{' + (sfmt == undefined ? '' : '') + sth + (sfmt == undefined ? '' : " '" + sfmt + "' ") + '}}</td>'; 
                    else
                        ttr += '<td class="' + scss + '">{{' + (sfmt == undefined ? '' : '>') + sth + '}}</td>'; 
                } else
                    ttr += '<td class="' + scss + '">{{' + (sfmt == undefined ? '' : '>') + sth + '}}</td>'; 
            } else {
                if (scnt != undefined) {
                    ttr += '<td class="' + scss + '">{{' + scnt + '}}</td>';
                }
            }
            if(sfmt != undefined) {
                if(sth.length > 5) if(sth.substr(0,5) != 'split')
                    hlppartials[sth] = sfmt;
            }
        });
        scr += ttr + '</tr>{{/data}}</script>';
        tb.closest('div').append(scr);
    }
    $.post('aim.asmx/dbLists1', { f: ddf, length: $('#' + ttc + ' .slength').val(), start: $('#' + ttc + ' .sstart').val() - 1, 'search[value]': $('#' + ttc + ' .ssearch').val() }, function (d) {
        //$.post('aim.asmx/dbLists1', { f: ddf }, function (d) {
        var template = $('#' + ttm).html(); var dt = JSON.parse(d)
        $('#' + ttc + ' .sstart').attr('max', dt.maxpages);
        var ss = eval($('#' + ttc + ' .sstart').val()); var sl = eval($('#' + ttc + ' .slength').val()); var sm = (((ss - 1) * sl) + sl);
        $('#' + ttc + ' .slabel').text((((ss - 1) * sl) + 1) + '-' + (sm <= dt.total ? sm : dt.total) + " of " + dt.total);
        var info = Handlebars.compile(template);
        Handlebars.registerHelper(hlpfunctions);
        Handlebars.registerPartial(hlppartials);
        if($('tbody',tb).length > 0) $('tbody',tb).html(info(dt)); else $(tb).html(info(dt)); tb.closest('div').data('dbrow', dt);
    });
}

function SetToInput(frm, data, midid) {
    if (data.length <= 0) return;
    if (midid == '') midid = frm.attr('name').substr(3);
    var ed = 0;
    var dataObj = $.each(data, function (key, value) {
        var $tobj = $('[name$=' + midid + key + ']', frm);
        oid = $tobj.attr('id');
        if (value == null)
            value = '';
        if (key.toString().indexOf('i') == 0 && key.toString().search('I') > 0) {
            $did = $("#" + key.slice(1) + midid + "i");
            $did1 = $('.images', $('[name$=' + midid + key.slice(1) + ']', frm).closest('.aifile'));
            $did.html(''); $did1.html('');
            tv = value.split(',');
            for (ii = 0; ii < tv.length; ii++) {
                var idiv = "<div class='aidc ais aifleft aibcontentimg'><img src='" + cc + "/u/" + tv[ii] + "' class='' style='width:100px;' /><div class='aidtr aidh'><button type='button' class='w3-zoomimg'><i class='fas fa-search-plus'></i></button><button type='button' class='airemoveimg'>x</button></div> </div>"
                $did.append(idiv); $did1.append(idiv);
            }
        }
        if ($tobj.hasClass('editor')) {
            $tobj.val(value); $('#' + $tobj.attr('id') + ' ~ [contenteditable=true]').html(value);
            //tinyMCE.get(oid).setContent(value);
        }
        else if ($tobj.attr('type') == 'radio')
            $tobj.attr('checked', false).filter('[value="' + value + '"]').attr('checked', true);
        else if ($tobj.attr('type') == 'date')
            $tobj.val(ymd(value));
        else if ($tobj.attr('type') == 'datetime' || $tobj.attr('type') == 'datetime-local')
            $tobj.val(ymdt(value));
        else if ($tobj.hasClass('ddl') || $tobj.hasClass('mddl')) {
            SetToSelect($tobj, value);
        }
        else if (key.indexOf('Country') > 0) {
            try {
                $tobj.attr('selected', false); $tobj.val(value);
                var sts = '<option>' + $tobj.find(':selected').data('states').replace(/,/g, '</option><option>') + '</option>';
                $('#' + $tobj.attr('id').replace('Country', 'State')).html('<option value="">-Select State-</option>').append(sts);
            } catch (ex) {

            }
        }
        else if (key.indexOf('State') > 0) {
            $tobj.attr('selected', false); $tobj.val(value);
        }
        else
            $tobj.val(value);

        //if (typeof value == 'object') {

        //} else if (typeof value == 'boolean') {
        //    $('#chk' + midid + key, frm).attr('checked', value);
        //} else if ((value.toString().substr(2, 1) == '/' && value.toString().substr(5, 1) == '/' && value.toString().substr(13, 1) == ':') || value.toString().substr(2, 1) == ':') {
        //    if ($('#tti' + midid + key, frm).length)
        //        $('#tti' + midid + key, frm).val(value.toString());
        //    else if ($('#tda' + midid + key, frm).length)
        //        $('#tda' + midid + key, frm).val(value.toString().substr(0, 10));
        //    else if ($('#tdt' + midid + key, frm).length)
        //        $('#tdt' + midid + key, frm).val(value.toString().substr(0, 16));
        //    else
        //        $('#txt' + midid + key, frm).val(value);
        //} else if ($('#txt' + midid + key, frm).hasClass('ddl')) {
        //    $('#txt' + midid + key, frm).select2('val', value);
        //    //$('#txt' + midid + key, frm).val(value).trigger('change');
        //} else if ($('#txt' + midid + key, frm).hasClass('mddl')) {
        //    //$('#txt' + midid + key, frm).val(value.split(',')).trigger('change');
        //    $('#txt' + midid + key, frm).select2('val', value.split(','));
        //} else if ($('#txt' + midid + key, frm).hasClass('editor')) {
        //    tinyMCE.editors[ed].setContent($(this).html().toString()); ed++;
        //} else if ($('#tpd' + midid + key, frm).length) {
        //    $('#tpd' + midid + key, frm).val(value);
        //} else if ($('#tpk' + midid + key, frm).length) {
        //    $('#tpk' + midid + key, frm).val(value);
        //} else {
        //    $('#txt' + midid + key, frm).val(value);
        //}
    });
    //setfocus(frm);
    try { var ff = 'AF' + midid + 'SetToInput(frm,data,midid)'; eval(ff); } catch (e) { }
}
function SetToSelect($tobj, value) {
    value = value == null || value == undefined ? '' : value;
    dd = $('label[for=' + $tobj.data('select2Id') + ']').data();
    if (dd.defaultdata != undefined) {
        $tobj.val(value); $tobj.trigger('change');
    } else if (unstr(dd.myquery).length > 0) {
        $.ajax({
            url: "aim.asmx/exDataSet", dataType: "json", type: "post"
                , data: { q: dd.myquery.replace(/_search_%'/g, "' AND a.id IN (N'" + value.toString().replace(/,/g, "',N'") + "')" || '') }
        }).then(function (data) {
            // create the option and append to Select2
            var dl = data.data1.length;
            if (dl > 0) {
                if ($tobj.hasClass('ddl')) {
                    $tobj.val(null); $tobj.trigger('change');
                    var option = new Option(data.data1[dl - 1].text, data.data1[dl - 1].id, true, true);
                    $tobj.append(option).trigger('change');
                } else if ($tobj.hasClass('mddl')) {
                    $tobj.val([]); $tobj.trigger('change');
                    for (tt = 0; tt < dl; tt++) {
                        option = new Option(data.data1[tt].text, data.data1[tt].id, true, true);
                        $tobj.append(option).trigger('change');
                    }
                }
                // manually trigger the `select2:select` event
                $tobj.trigger({ type: 'select2:select', params: { data: data1 } });
            }
        });
    } else {
        var pg = 25;
        if (dd.ocondition == undefined) dd.ocondition = dd.condition;
        dd.condition = "a.id IN (N'" + value.toString().replace(/,/g, "',N'") + "') AND (" + dd.ocondition + ')';
        $.ajax({
            url: "aim.asmx/dbLists1", dataType: "json", type: "post"
                , data: { f: dd, 'search[value]': '', 'length': pg, start: (0) * pg }
        }).then(function (data) {
            // create the option and append to Select2
            var dl = data.data.length;
            if (dl > 0) {
                if ($tobj.hasClass('ddl')) {
                    $tobj.val(null); $tobj.trigger('change');
                    var option = new Option(data.data[dl - 1].text, data.data[dl - 1].id, true, true);
                    $tobj.append(option).trigger('change');
                } else if ($tobj.hasClass('mddl')) {
                    $tobj.val([]); $tobj.trigger('change');
                    for (tt = 0; tt < dl; tt++) {
                        option = new Option(data.data[tt].text, data.data[tt].id, true, true);
                        $tobj.append(option).trigger('change');
                    }
                }
                // manually trigger the `select2:select` event
                $tobj.trigger({ type: 'select2:select', params: { data: data } });
            }
        });
    }
}
function GeneralCall(f0) {
    var f1 = f0.slice(1);
    $("input.tdl, input.ddf, input.ddt, input.ddl, input.mddl, select", f0).each(function () { if ($(this).hasClass('ddf') || $(this).hasClass('ddt') || $(this).hasClass('ddl') || $(this).hasClass('mddl')) { selectfk(this); } else if ($(this).hasClass('tdl')) { selecttype(this); } });
    //$(".aieditor", f0).prepend("<div class='aitoolbar ais aipr clearfix'> <nav> <ul class='aimnavnav'> <li><a href='javascript:void(0)' tabindex='-1' data-command='bold'><i class='fa fa-bold'></i></a> <ul class='aimsubmenu'> <li><a href='javascript:void(0)' tabindex='-1' data-command='italic'><i class='fa fa-italic'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='underline'><i class='fa fa-underline'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='strikeThrough'><i class='fa fa-strikethrough'></i></a></li> </ul> </li> <li><a href='javascript:void(0)' tabindex='-1' data-command='justifyLeft'><i class='fa fa-align-left'></i></a> <ul class='aimsubmenu'> <li><a href='javascript:void(0)' tabindex='-1' data-command='justifyCenter'><i class='fa fa-align-center'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='justifyRight'><i class='fa fa-align-right'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='justifyFull'><i class='fa fa-align-justify'></i></a></li> </ul> </li> <li><a href='javascript:void(0)' tabindex='-1' data-command='indent'><i class='fa fa-indent'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='outdent'><i class='fa fa-outdent'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='insertUnorderedList'><i class='fa fa-list-ul'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='insertOrderedList'><i class='fa fa-list-ol'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='h1'>H1</a> <ul class='aimsubmenu'> <li><a href='javascript:void(0)' tabindex='-1' data-command='h2'>H2</a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='h3'>H3</a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='h4'>H4</a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='h5'>H5</a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='h6'>H6</a></li> </ul> </li> <li><a href='javascript:void(0)' tabindex='-1' data-command='table'>table</a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='createlink'><i class='fa fa-link'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='unlink'><i class='fa fa-unlink'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='insertimage'><i class='fa fa-image'></i></a></li> <li><a tabindex='-1' data-command='insertimg' id='1editort" + f1.replace('F00','') + "PFull'  data-id='#PP" + f1 + "' data-menu='9997`4002``000000001```0`1024px' data-parent='" + f1 + "' data-images='#t4002PFImages' class='opensubform' data-prefix='posid' data-folder='pos/' data-imagesize='0100011000' data-croparea='1.3333333333333333' data-thumbsize='100'><i class='fa fa-image'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='p'>P</a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='subscript'><i class='fa fa-subscript'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='superscript'><i class='fa fa-superscript'></i></a></li> <li><a href='javascript:void(0)' tabindex='-1' data-command='code'><i class='fas fa-code'></i></a></li> </ul> </nav> </div> ");
    if($(".aieditor", f0).length > 0) {
    $(".aieditor", f0).prepend($('#tmpled1').html().replace(/aaaa/g, f0.slice(4)));
    $(".aieditor", f0).append('<div id="editor' + $(".aieditor textarea", f0).attr('id') + '" class="aiedit" contenteditable="true"><p>&nbsp;</p></div>');
    }
}
//$(document).on('focus', '.ddl, .mddl', function (e) {
//    if (e.originalEvent) {
//        $(this).siblings('select').select2('open');
//    }
//});
function selecttype(ctl, frm) { $(ctl).typeahead({ source: function (query, process) { return $.get("sgs.asmx/dbList1", { qtype: $(ctl).data("qtype"), table: $(ctl).data("table"), cond: $(ctl).data("condition") + ' AND (' + ($(ctl).data("condition1") == undefined ? '1=1' : $(ctl).data("condition1")) + ')', pid: 0, q: query, offset: 1, limit: 999 }, function (data) { var datatojson = jQuery.parseJSON(data.replace(/text/g, 'name')); return process(datatojson.rows); }); }, autoSelect: true, items: 'all', minLength: 1 }); }
function selectfk(ctl, frm) {
    dd = $(ctl).data(); cid = $(ctl).attr('id'); cnt = $(ctl).closest('.container');
    $('label[for=' + cid + ']').data(dd);
    var mul = unbool(dd.multiple);
    mn = $(ctl).data('menu') == undefined ? '' : 'data-menu="' + $(ctl).data('menu') + '"';
    af = $(ctl).attr('autofocus'); var cl = $(ctl).attr('class');
    //$(ctl).replaceWith('<select id="' + cid + '" name="' + cid + '" class="w3-input ' + (mul ? 'mddl' : 'ddl') + '"' + mn + ' ></select>').data(dd);
    if($(ctl)[0].tagName != "SELECT") {
        $(ctl).replaceWith('<select id="' + cid + '" name="' + cid + '" class=" ' + cl + '"' + mn + ' ></select>').data(dd);
        $('#' + cid).attr('autofocus', af);
    }
    if (unstr(dd.defaultdata).length > 0) {
        if (mul) {
            $('#' + cid).select2({ multiple: mul, data: eval(dd.defaultdata) }); return;
        } else {
            ddf = eval(dd.defaultdata); var dds = "";

            for (i = 0; i < ddf.length; i++) {
                if (ddf[i].id == undefined)
                    dds += "<option value='" + ddf[i] + "'>" + ddf[i] + "</option>";
                else
                    dds += "<option value='" + ddf[i].id + "'>" + ddf[i].text + "</option>";
            }
            $('#' + cid).append(dds); 
        }
    } else if(unstr(dd.myquery).length > 0) {
        if ($(ctl).hasClass('noselect2')) {

        }
        var pg = 25;
        $('#' + cid).select2({
            dropdownAutoWidth: 'true', multiple: mul, width: "resolve"
            , ajax: {
                url: "aim.asmx/exDataSet", dataType: "json", type: "post"
                , data: function (params) {
                    return { q: $(ctl).data('myquery').replace(/_search_/g, params.term || '')  };
                    //'search[value]': params.term || '', 'length': pg, start: (params.page || 0) * pg };
                }, processResults: function (data, params) {
                    params.page = params.page || 1; return {
                        results: data.data1, pagination: {
                            //more: (params.page * pg) < data.total
                        }
                    };
                }, cache: false
            }
            , escapeMarkup: function (markup) { return markup; }
        });
    } else {
        if ($(ctl).hasClass('noselect2')) {
            $.ajax({
                url: "aim.asmx/dbLists1", dataType: "json", type: "post"
                    , data: { f: $(ctl).data(), 'search[value]': '', 'length': 999, start: (0) * 999 }
            }).then(function (data) {
                // create the option and append to Select2
                //debugger;
                var dval = $(ctl).attr('value');
                var dl = data.data.length;
                if (dl > 0) {
                    optn = "";
                    for (tt = 0; tt < dl; tt++) {
                        optn += '<option value="' + data.data[tt].id + '"' + (data.data[tt].id == dval ? ' selected ' : '') + '>' + data.data[tt].text + '</option>';
                    }
                    $(ctl).append(optn);
                }
            });
        } else {
            var pg = 25;
            $('#' + cid).select2({
                dropdownAutoWidth: 'true', multiple: mul, width: "resolve"
                , ajax: {
                    url: "aim.asmx/dbLists1", dataType: "json", type: "post"
                    , data: function (params) {
                        return { f: $(ctl).data(), 'search[value]': params.term || '', 'length': pg, start: (params.page || 0) };
                    }, processResults: function (data, params) {
                        params.page = params.page || 1; return {
                            results: data.data, pagination: {
                                more: (params.page * pg) < data.total
                            }
                        };
                    }, cache: true
                }
                , escapeMarkup: function (markup) { return markup; }
            });
        }
    }
}
function selectoptions(mul, defdata, fieldnames, qtype, table, con, con1) {
    if (defdata != undefined) { return { multiple: mul, data: { results: eval(defdata) } }; }
    return {
        dropdownAutoWidth: 'true', multiple: mul, width: "resolve", formatResult: function (item) {
            var fieldNames = eval(fieldnames); if (fieldNames == undefined) return item.text; else {
                var text = '<div class="row">'; $.each(fieldNames, function (index, fieldName) {
                    if (index === 0) { if (fieldNames.length === 1) { text = text + '<div class="col-md-12">' + item[fieldName.f] + '</div>'; } else { text = text + '<div class="col-md-' + fieldName.c + '">' + item[fieldName.f] + '</div>'; } } else {
                        if (item[fieldName.f] === undefined)
                            item[fieldName.f] = ''; text = text + '<div class="col-md-' + fieldName.c + '">' + item[fieldName.f] + '</div>';
                    }
                }); return text + '</div>';
            }
        }, ajax: { url: "sgs.asmx/ddlList", dataType: "json", data: function (term, page) { return { qtype: qtype, table: table, cond: con + ' AND (' + (con1 == undefined ? '1=1' : con1) + ')', pid: 0, q: term, offset: page, limit: 10 }; }, results: function (data, page) { var more = (page * 10) < data.total; return { results: data.rows, more: more }; } }, initSelection: function (element, callback) { var id = encodeURIComponent($(element).val()); var ajaxrun = false; if (id !== "") if (id !== "0") ajaxrun = true; if (id !== "0") if (id !== "") ajaxrun = true; if (ajaxrun) { $.ajax("sgs.asmx/ddlList" + "?qtype=" + qtype + "&table=" + table + "&cond=" + con + "&pid=" + id + "&q=&offset=&limit=10", { dataType: "json" }).done(function (data) { try { if (mul) callback(data.rows); else callback(data.rows[0]); } catch (ex) { er = ex; } }); } else { try { if (mul) callback([{ "text": " ", "id": 0 }]); else callback({ "text": " ", "id": 0 }); } catch (ex) { er = ex; } } }, escapeMarkup: function (markup) { return markup; }, cache: true
    };
}
function isformvalid(i) { var myf = document.getElementById(i); if (!myf.checkValidity()) { var tmpSubmit = document.createElement('button'); myf.appendChild(tmpSubmit); tmpSubmit.click(); myf.removeChild(tmpSubmit); return false; } else {return true;} }
function tabs(m, c) {

}
function ymd(str) { return str.toString().substr(6, 4) + '-' + str.toString().substr(3, 2) + '-' + str.toString().substr(0, 2); }
function ymdt(str) { return str.toString().substr(6, 4) + '-' + str.toString().substr(3, 2) + '-' + str.toString().substr(0, 2) + (str.toString().length > 10 ? 'T' + str.toString().substr(11) : ''); }
// Scroll to top button appear
$(document).scroll(function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
        $('.scrolltop').fadeIn();
    } else {
        $('.scrolltop').fadeOut();
    }
});
// Smooth scrolling using jQuery easing
$(document).on('click', 'a.scrolltop', function (event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
});

var elem = document.documentElement;
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

var aiary = {};
function loadScript(scriptName, callback) {
    if (!aiary[scriptName]) {
        aiary[scriptName] = true;

        var body = document.getElementsByTagName('body')[0];
        var script;
        if (scriptName.indexOf('.css') >= 0) script = '<link href="' + scriptName + '" rel="stylesheet" />';
        else {
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = scriptName;
        }

        script.onload = callback;
        body.appendChild(script);
    } else if (callback) {
        callback();
    }
};

function agey(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function NumberToWords() {
    var units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
    var teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];
    var tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    var othersIndian = ["Thousand", "Lakh", "Crore"];
    var othersIntl = ["Thousand", "Million", "Billion", "Trillion"];
    var INDIAN_MODE = "indian";
    var INTERNATIONAL_MODE = "international";
    var currentMode = INDIAN_MODE;
    var getBelowHundred = function (n) {
        if (n >= 100) { return "greater than or equal to 100"; };
        if (n <= 10) { return units[n]; };
        if (n <= 20) { return teens[n - 10 - 1]; };
        var unit = Math.floor(n % 10);
        n /= 10;
        var ten = Math.floor(n % 10);
        var tenWord = (ten > 0 ? (tens[ten] + " ") : '');
        var unitWord = (unit > 0 ? units[unit] : '');
        return tenWord + unitWord;
    };
    var getBelowThousand = function (n) {
        if (n >= 1000) { return "greater than or equal to 1000"; };
        var word = getBelowHundred(Math.floor(n % 100));
        n = Math.floor(n / 100);
        var hun = Math.floor(n % 10);
        word = (hun > 0 ? (units[hun] + " Hundred ") : '') + word;
        return word;
    };
    return {
        numberToWords: function (n) {
            if (isNaN(n)) { return "Not a number"; };
            var word = '';
            var val;
            val = Math.floor(n % 1000);
            n = Math.floor(n / 1000);
            word = getBelowThousand(val);
            if (this.currentMode == INDIAN_MODE) {
                othersArr = othersIndian;
                divisor = 100;
                func = getBelowHundred;
            } else if (this.currentMode == INTERNATIONAL_MODE) {
                othersArr = othersIntl;
                divisor = 1000;
                func = getBelowThousand;
            } else { throw "Invalid mode - '" + this.currentMode + "'. Supported modes: " + INDIAN_MODE + "|" + INTERNATIONAL_MODE; };
            var i = 0;
            while (n > 0) {
                if (i == othersArr.length - 1) {
                    word = this.numberToWords(n) + " " + othersArr[i] + " " + word;
                    break;
                };
                val = Math.floor(n % divisor);
                n = Math.floor(n / divisor);
                if (val != 0) {
                    word = func(val) + " " + othersArr[i] + " " + word;
                };
                i++;
            };
            return word;
        },
        setMode: function (mode) {
            if (mode != INDIAN_MODE && mode != INTERNATIONAL_MODE) {
                throw "Invalid mode specified - '" + mode + "'. Supported modes: " + INDIAN_MODE + "|" + INTERNATIONAL_MODE;
            };
            this.currentMode = mode;
        }
    }
}

function indianwords(n) {
    var num2words = new NumberToWords();
    num2words.setMode("indian");
    var indian = num2words.numberToWords(n);
    return indian;
}
function aiLazy(cobj) {
    var width = $(window).width();
    var height = $(window).height();
    if ((width >= 1280) && (height >= 1024)) {
        $('img:not(.b-loaded)', cobj).each(function () { $(this).attr('src', $(this).data('src')); $(this).addClass('b-loaded'); });
    } else {
        $('img:not(.b-loaded)', cobj).each(function () { $(this).attr('src', $(this).data('small') == undefined ? $(this).data('src') : $(this).data('small')); $(this).addClass('b-loaded'); });
    }
}
function showimg(p, s) {
    var si = s.split(',');
    var ri = "";
    for (i = 0; i < si.length; i++) {
        ri += '<div class="aioh"><img class="aiw100 b-lazy aie2" src="' + p + 'u/' + si[i] + '" data-src="' + p + 'u/' + si[i].replace('--100.', '--480.') + '"></div>';
    }
    return ri;
}
function getQS(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return undefined;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
$.getMultiScripts = function(arr, path) {
    var _arr = $.map(arr, function(scr) {
        return $.getScript( (path||"") + scr );
    });

    _arr.push($.Deferred(function( deferred ){
        $( deferred.resolve );
    }));

    return $.when.apply($, _arr);
}
function initl(nm) { var matches = nm.match(/\b(\w)/g); var acronym = matches.join(''); return '<span class="aibadgein">' + acronym + '</span>'; }

$(function () {
    $('body').off('click', '.reguser a').on('click', '.reguser a', function () {
        if (window.location.href.toString().toLowerCase().indexOf("adminsite") <= 0) {
            var fid = $(this).data('menu').split('`')[0];
            if ($('#AC' + fid).html()) {
                $('.aibcontent:not(:hidden)', cntr).hide(); $('#AC' + fid).show(); $('main').scrollTop();
                $('input[autofocus=autofocus]', '#AC' + fid).focus();
            } else {
                loadPage($(this));
            }
        }
    });
    $('.reguser a:first').trigger('click').addClass('active');

    $('body').off('click',
        'button.regback').on('click',
        'button.regback',
        function () {
            $('.reguser a.active').removeClass('active').prev('a').addClass('active').trigger('click');
        });
    $('body').off('click',
        'button.regskip').on('click',
        'button.regskip',
        function () {
            $c = $('.reguser a.active');
            $c.removeClass('active'); $c.next('a').addClass('active').trigger('click');
        });
});
function AFOnRegLoad(dt) {
    $('.reguser a.active').removeClass('active').next('a').addClass('active').trigger('click');
}
function AFOnRegLoad1(dt) {
    tload = confirm('You are successfully Registered ... Start New Registration ... ?');
    if (tload) {
        if (window.location.href.toString().toLowerCase().indexOf("adminsite") <= 0) {
            location.reload();
        }
    } else {  }
}