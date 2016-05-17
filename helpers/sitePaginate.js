
var extend = require('extend');
var querystring = require('querystring');
var hbs = require('hbs');

var Paginate = function(context, options) {
    this.start = context.start || 0;
    this.limit = context.limit || 10;
    // total record count for paginate
    this.total = context.total || 0;
    // how many links arround current page
    this.innerWindow = context.innerWindow || 5;
    this.query = extend(true, {}, context.query);
    this.page = Math.ceil(this.start / this.limit) + 1;
    this.totalPages = Math.ceil(this.total / this.limit);
    this.hasPrev = this.start > 0;
    this.hasNext = this.start + this.limit < this.total;
};

Paginate.prototype.prevPage = function() {
    if (this.hasPrev) {
        this.query.start = this.start - this.limit;
        var url = '?' + querystring.stringify(this.query);
        return ['<li><a href="', url, '">上一页</a></li>'].join('');
    }
    return '<li class="disabled"><span>上一页</span></li>';
};

Paginate.prototype.nextPage = function() {
    if (this.hasNext) {
        this.query.start = this.start + this.limit;
        var url = '?' + querystring.stringify(this.query);
        return ['<li><a href="', url, '">下一页</a></li>'].join('');
    }
    return '<li class="disabled"><span>下一页</span></li>';
};

Paginate.prototype.iterPages = function(callback) {
    var winFrom = 1;
    if (this.page > this.innerWindow) {
        if (this.page+ this.innerWindow > this.totalPages) {
            winFrom = this.totalPages - this.innerWindow * 2 + 1;
            if (winFrom < 1) {
                winFrom = 1;
            }
        } else {
            winFrom = this.page - this.innerWindow;
        }
    }
    var winTo = winFrom + this.innerWindow * 2 - 1;
    if (winTo > this.totalPages) {
        winTo = this.totalPages;
    }
    for(var page = winFrom; page <= winTo; page++) {
        this.query.start = (page - 1) * this.limit;
        var url = '?' + querystring.stringify(this.query);
        if (page == this.page) {
            callback(['<li class="active"><a href="', url, '">', page, '</a></li>'].join(''));
        } else {
            callback(['<li><a href="', url, '">', page, '</a></li>'].join(''));
        }
    }
};

Paginate.prototype.renderString = function() {
    if (this.totalPages <= 1) {
        return '';
    }
    var info = [
        '<span style="display: block; float: left; padding: 5px 10px;">',
        "共"+this.totalPages+"页", '/',this.total+"条",
        '</span>'
    ].join('');
    var links = [info, '<ul class="pagination pagination-sm no-margin">'];
    links.push(this.prevPage());
    this.iterPages(function(link) {
        links.push(link);
    });
    links.push(this.nextPage());
    links.push('</ul>');
    return links.join('\n');
};

module.exports = function(context, options) {
    var paginate = new Paginate(context, options);
    return new hbs.SafeString(paginate.renderString());
};