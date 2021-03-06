window.onload = function(){
    var dog = {
        $: function(selector) {
            return document.querySelector(selector);
        },
        on: function(el, type, handler) {
            el.addEventListener(type, handler, false);
        },
        off: function(el, type, handler) {
            el.removeEventListener(type, handler);
        },
        position: function(obj, attr) {
            if (obj) {
                var method = obj.getBoundingClientRect();
                return attr ? method[attr] : method;
            } else {
                console.log('对象不存在！');
            }
        },
        cache: {},
        tpl: function(str, data) {
            var fn = !/\s/.test(str) ?
                this.cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) :
                new Function("obj", "var p='';p+='" +
                    str.replace(/[\r\n\t]/g, " ")
                    .split('\\').join("\\\\")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "'+$1+'")
                    .split("\t").join("';")
                    .split("%>").join("p+='")
                    .split("\r").join("\\'") +
                    "';return p;");

            return data ? fn.call(data) : fn;
        }
    }

    function Calendar() {
        var args = arguments[0],
            dom = args.dom;
        for (var key in args) {
            if (key == 'dom') {
                this.getDom(dom);
            } else {
                this[key] = args[key];
            }
        }
        this.init();
    }
    Calendar.prototype = {
        init: function() {
            this.render();
        },
        bind: function() {

        },
        now: new Date(),
        _dom: {
            prev: '.prev',
            next: '.next',
            switch: '.switch'
        },
        setDom: function() {
            this.getDom(this._dom);
        },
        getDom: function(dom) {
            for (var prop in dom) {
                this[prop] = dog.$(dom[prop]);
            }
        },
        render: function() {
            var that = this,
                pos = dog.position(this.input),
                data = this.zh,
                div = document.createElement('div'),
                el = null,
                html = dog.tpl(this.tpl[0], data);

            if (el = document.getElementById('my-calendar')) {
                el.style.display = 'block';
                this.calendar = el;
            } else {
                createCalendar();
                that.fillWeek();
                that.fill();
                that.fillYear();
                that.setDom();
                that.hideHandle();
                that.addNextMonth();
                that.addPrevMonth();
            }

            function createCalendar() {
                div.innerHTML = that.tpl[0];
                div.className = 'my-date';
                div.id = 'my-calendar';
                div.style.top = 52 + 'px';
                div.style.left = 23 + 'px';
                div.children[0].style.display = 'block';
                that.container.appendChild(div);
                that.calendar = div;
            }
        },
        fillWeek: function() {
            var html = '<tr>',
                n = 0,
                days = this.zh.days;

            while (n < days.length) {
                html += '<th class="dow">' + days[n++] + '</th>';
            }
            html += '</tr>';
            this.calendar.querySelector('.datetimepicker-days thead').innerHTML += html;
        },
        fill: function(now) {
            var calendar = this.calendar,
                tBody = calendar.querySelector('tbody'),
                time = now || this.getFullTime(),
                startDay = (new Date(time.year, time.month - 1, 1)).getDay(),
                date = this.getDaysInMonth(time.year, time.month),
                html = '',
                n = 1,
                tr = null,
                td = null;

            this.time = time;
            tBody.innerHTML = '';
            for (var i = 0; i < 6; i++) {
                tr = tBody.insertRow(i);
                for (var j = 0; j < 7; j++) {
                    td = tr.insertCell(j);
                    if (n <= date) {
                        td.innerHTML = startDay-- > 0 ? '' : (td.className = 'day', n++);
                    }
                    if (td.innerHTML == time.day) {
                        td.className += ' active';
                    }
                }
            }

            tBody.appendChild(tr);
        },
        fillYear: function() {
            var el = this.calendar.querySelector('.switch'),
                time = this.time;

            el.innerHTML = time.year + '年' + time.month + '月';
        },
        getFullTime: function(now) {
            var time = now || new Date(),
                year = time.getFullYear(),
                week = time.getDay(),
                day = time.getDate(),
                month = time.getMonth();

            this.month = month;
            return {
                date: time,
                year: year,
                week: week,
                day: day,
                month: month + 1
            }
        },
        /**
         * 得到一个月多少天
         * @param  {[type]} year  [description]
         * @param  {[type]} month [description]
         * @return {[type]}       [description]
         */
        getDaysInMonth: function(year, month) {
            return new Date(year, parseInt(month), 0).getDate();
        },
        /**
         * 点击其它地方隐藏
         * @return {[type]} [description]
         */
        hideHandle: function() {
            var that = this;

            dog.on(document, 'click', function(e) {
                if (that.calendar != e.target) {
                    that.hideCalendar();
                    that.removeNextMonth();
                }
            });

            dog.on(this.calendar, 'click', function(e) {
                var target = e.target;

                if (target.className.indexOf('day') != -1) {
                    that.hideCalendar();
                    that.setTime.call(that, target.innerHTML);
                }
                e.stopPropagation();
            });
        },
        setTime: function(val) {
            var time = this.time;
            this.input.value = time.year + '-' + time.month + '-' + val;
        },
        hideCalendar: function() {
            this.calendar.style.display = 'none';
        },
        addNextMonth: function() {
            dog.on(this.next, 'click', this.nextMonthHandle.bind(this));
        },
        nextMonthHandle: function(e) {
            var date = this.time.date

            date.setMonth(++this.month)
            this.fill(this.getFullTime(date))
            this.fillYear()
        },
        removeNextMonth: function() {
            dog.off(this.next, 'click', this.nextMonthHandle.bind(this));
        },
        addPrevMonth: function() {
            dog.on(this.prev, 'click', this.prevMonthHandle.bind(this));
        },
        prevMonthHandle: function(e) {
            var date = this.time.date

            date.setMonth(--this.month)
            this.fill(this.getFullTime(date))
            this.fillYear()
        }
    }

    var defaults = {
        dom: {
            container: '#calendar',
            input: '#input'
        },
        zh: {
            days: ['日', '一', '二', '三', '四', '五', '六'],
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二'],
            today: '今天',
            clear: '清空'
        },
        tpl: [
            '<div class="datetimepicker datetimepicker-dropdown-bottom-right dropdown-menu">' +
            '<div class="datetimepicker-days">' +
            '<table class="table-condensed">' +
            '<thead>' +
            '<tr>' +
            '<th class="prev"><i class="icon-arrow-left"></i></th>' +
            '<th colspan="5" class="switch"></th>' +
            '<th class="next"><i class="icon-arrow-right"></i></th>' +
            '</tr>' +
            '</thead>' +
            '<tbody></tbody>' +
            '<tfoot class="none">' +
            '<tr><th colspan="7" class="today"></th></tr>' +
            '<tr><th colspan="7" class="clear"></th></tr>' +
            '</tfoot>' +
            '</table>' +
            '</div>' +
            '</div>',
            '1'
        ]

    };
    document.getElementById('input').onclick = function(e) {
        new Calendar(defaults);
        e.stopPropagation();
    };

    (function(){
        function getDate(){
            var today = new Date(); 
            var date = ''; 
            date = (today.getFullYear()) +"-" + (today.getMonth() + 1 ) + "-" + today.getDate() ; 
            return date;
        };
        
        document.getElementById('input').value = getDate();
    })();
}