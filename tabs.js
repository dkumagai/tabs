//requires url
define(function(require) {
    'use strict';

    require("url");

    var settings = {
        el : null, //required
        onChange : $.noop,
        hash : null
    };

    function create(options){
        var tabs = {};
        tabs.options = $.extend({}, settings, options);
        bind(tabs);
        tabs.cacheDom();
        tabs.attachEvents();
        if(tabs.options.hash){
            tabs.showTab(url("#" + tabs.options.hash) || 0);
        }else{
            tabs.showTab(0);
        }
    }

    function bind(tabs){
        tabs.cacheDom = cacheDom.bind(tabs);
        tabs.attachEvents = attachEvents.bind(tabs);
        tabs.tabClick = tabClick.bind(tabs);
        tabs.showTab = showTab.bind(tabs);
        tabs.updateHash = updateHash.bind(tabs);
        tabs.hashChanged = hashChanged.bind(tabs);
    }

    function cacheDom(){
        this.dom = {};
        this.dom.el = this.options.el;
        this.dom.tabs = this.dom.el.find(".tab");
        this.dom.tabContents = this.dom.el.find(".tab-content");
    }

    function attachEvents(){
        this.dom.tabs.on("click", this.tabClick);
        $(window).on("hashchange", this.hashChanged);
    }

    function tabClick(e){
        var tabName = $(e.currentTarget).attr("data-tab");
        this.showTab(tabName);
    }

    function showTab(tabName){
        this.dom.tabContents.removeClass("selected");
        this.dom.tabs.removeClass("selected");

        if(typeof(tabName) == "number"){
            tabName = this.dom.tabContents.eq(tabName).attr("data-tab");
        }
            
        this.dom.tabContents.filter("[data-tab=\""  + tabName + "\"]").addClass("selected");
        this.dom.tabs.filter("[data-tab=\""  + tabName + "\"]").addClass("selected");
        this.updateHash(tabName);
        this.options.onChange(tabName);
    }

    function updateHash(tabName){
        if(this.options.hash){
            var hash = url("#" + this.options.hash);
            if(hash){
                window.location.href = window.location.href.replace(this.options.hash + "=" + hash, this.options.hash + "=" + tabName);
            }else if(url("#")){
                window.location.href = window.location.href + "&" + this.options.hash + "=" + tabName;
            }else{
                window.location.href = window.location.href + "#" + this.options.hash + "=" + tabName;
            }
        }
    }

    function hashChanged(){
        var hash = url("#" + this.options.hash);
        this.showTab(hash);
    }

    return {
        create : create
    };

});