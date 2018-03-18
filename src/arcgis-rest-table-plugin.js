$.fn.extend({

    sortableTable: function(options) {
        var styleEl = document.createElement('style');
        styleEl.innerHTML = `
        @import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro"); 
        @import url("https://fonts.googleapis.com/icon?family=Material+Icons");
        .action-menu ul li .material-icons {
            float: right;
            position: relative;
            bottom: -2px;
            font-size: 16px;
        }
        `;
        document.head.appendChild(styleEl);

        var resultDivArray = [];
        var initState;

        var style = {

            "sort-bar": {
                "padding": "8px",
                "border-spacing": "7px",
                "-webkit-border-horizontal-spacing": "5px",
                "-webkit-border-vertical-spacing": "5px",
                "margin": " 0 5px 0 5px",
                "text-align": "right",
                "z-index": 1000
            },

            "sort-bar-text": {
                "vertical-align": "top",
                "margin-right": "2px",
                "font-size": "15px",
                "cursor": "pointer"
            },

            "action-menu": {
                "position": "absolute",
                "top": "2px",
                "right": "9px",
                "box-shadow": "#888 0 0 1px 1px",
                "background": "white",
                "display": "none",
                "cursor": "pointer",
                "font-size": "12px",
                "text-align": "left",
                "max-height": "272px",
                "overflow-y": "auto"
            },

            "action-menu-ul": {
                "margin": 0,
                "padding": 0,
                "border": 0,
                "font-size": "100%",
                "font": "inherit",
                "vertical-align": "baseline",
                "list-style": "none"
            },

            "action-menu-li": {
                "background-color": "#FFF",
                "position": "relative",
                "padding": "10px"
            },

            "action-menu-material-icons": {
                "float": "right",
                "position": "relative",
                "bottom": "-2px"
            },

            "action-menu-input": {
                "display": "none"
            },

            "action-menu-second": {
                "right": "69px"
            },

            "action-menu-label": {
                "display": "block",
                "width": "100%"
            },

            "list-header": {
                "font-size": "14px"
            },

            "yellow-list-table": {
                "width": "100%",
                "text-align": "left",
                "overflow-y": "auto",
                "border-spacing": "5px"
            },


            "yellow-list-table-th": {
                "width": "100%",
                "text-align": "center"
            },

            "yellow-list-table-td": {
                "border-left": "4px solid #FFC107",
                "box-shadow": "rgba(158, 158, 158, 0.42) 0px 0px 0px 1px",
                "padding": "8px",
                "cursor": "pointer"
            },

            "yellow-list-table-td:hover": {
                "border-left": "4px solid #FFC107",
                "box-shadow": "rgba(158, 158, 158, 0.42) 0px 0px 0px 1px",
                "padding": "8px",
                "cursor": "pointer",
                "background": "#FFC107"
            },

            "yellow-list-material-icons-action": {
                "float": "right"
            }

        };


        var methods = {

            addTable: function(a, url, nameField, sortField, back) {
                var assignID = "table" + (Math.random() * 100).toFixed(0);
                $(a).show();
                initState = $(a).html();
                if ($(a).html().indexOf("<table") === -1) {
                    $(a).append(
                        '<table class="yellow-list" id="' + assignID + '">' +
                        '<tbody id="fbody">' +
                        '<tr></tr>' +
                        ' </tbody>' +
                        '</table>'
                    );

                    //applying styles
                    $('table.yellow-list').css(style["yellow-list-table"]);


                    require(["esri/tasks/query", "esri/tasks/QueryTask"],
                        function(Query, QueryTask) {
                            var QTask = new QueryTask(url);
                            var Qry = new Query();
                            Qry.where = "0=0";
                            Qry.returnGeometry = true;
                            if (sortField) {
                                Qry.outFields = [nameField, sortField];
                            } else {
                                Qry.outFields = [nameField];
                            };
                            QTask.execute(Qry, populateArray);

                        });

                    function populateArray(results) {
                        var ResultFeatures = results.features;
                        for (var p = 0; p < ResultFeatures.length; p++) {
                            resultDivArray.push({ Name: ResultFeatures[p].attributes[nameField], Type: ResultFeatures[p].attributes[sortField], Geometry: ResultFeatures[p].geometry });
                        }
                        populateDiv(resultDivArray);
                    }

                    function populateDiv(list) {
                        $('#' + assignID + ' tr').remove();
                        $('#' + assignID).append("<tr></tr>");
                        for (var i = 0; i < list.length; i++) {
                            var name = list[i].Name.toString();
                            var type = list[i].Type;
                            var geom = JSON.stringify(list[i].Geometry);
                            var string = '';
                            if (type) {
                                $('#' + assignID + ' tr:last').after('<tr' + ' id="' + name.substring(0, 3) + assignID + '" class=" even"><td><span class="list-header">' + name + '</span><br><text class="cat">' + type + '</text><i class="material-icons action">search</i></td></tr>');
                            } else {
                                $('#' + assignID + ' tr:last').after('<tr' + ' id="' + name.substring(0, 3) + assignID + '" class="even"><td><span class="list-header">' + name + '</span><i class="material-icons action">search</i></td></tr>');
                            }
                        };

                        //applying styles
                        $('#' + assignID + ' .list-header').css(style["list-header"]);
                        $('table.yellow-list td').css(style["yellow-list-table-td"]);
                        $('table.yellow-list .material-icons.action').css(style["yellow-list-material-icons-action"]);


                        $('#' + assignID + ' td').each(function(a, b) {
                            var geom = list[a].Geometry;
                            $(b).on('click', function() {
                                if (geom.type === "polygon") {
                                    map.setExtent(geom.getExtent());
                                    
                                    //var mapPoint = geom.getExtent().getCenter();
                                    //var screenPoint = esri.geometry.toScreenPoint(map.extent, map.width, map.height, mapPoint);
                                    //setTimeout(function(){map.emit('click', { mapPoint, screenPoint, bubbles: false, cancelable: true })},100);
                                } else {
                                    map.centerAndZoom(geom, 18);
                                    
                                    //var mapPoint = geom;
                                    //var screenPoint = esri.geometry.toScreenPoint(map.extent, map.width, map.height, mapPoint);
                                    //setTimeout(function(){map.emit('click', { mapPoint, screenPoint, bubbles: false, cancelable: true })},100);
                                }
                            })
                        })
                    };
                };

                methods.addSortBar('#' + assignID, sortField, back);
            },

            addSortBar: function(a, sortField, back) {
                console.log(a);
                var s = $(a);

                $('#' + s[0].id + ' tbody tr').first().before(
                    '<div class="sort-bar" >' +
                    '<label style="float: left;display:none" id="backArrow">' +
                    '<i class="material-icons" style="font-size:18px;cursor:pointer;">arrow_back</i><text> back</text>' +
                    '</label>' +
                    '<label id="sortDiv" style="display:none">' +
                    '<text>Filter</text>' +
                    '<i class="material-icons" style = "padding-right: 5px; font-size:18px;cursor:pointer; vertical-align: middle">sort</i>' +
                    '</label>' +
                    '<label  style="padding-left:10px">' +
                    '<text>Sort</text>' +
                    '<i class="material-icons" style="font-size:18px;cursor:pointer; vertical-align: middle">sort_by_alpha</i>' +
                    '</label>' +
                    '</div>'
                );


                s.append(
                    '<div class="sortMenu action-menu">' +
                    '<ul>' +
                    '<li>Ascending<i class="material-icons" id="AscBtn">radio_button_checked</i></li>' +
                    '<li>Descending<i class="material-icons" id="DscBtn">radio_button_unchecked</i></li>' +
                    '</ul>' +
                    '</div>' +
                    '<div id="sortBar' + a.substring(1, 9) + '" class="filterMenu action-menu second">' +
                    '<ul>' +
                    '</ul>' +
                    '</div>'
                );

                //mapping event listeners

                if (back === true) {
                    var backArrow = $('#' + s[0].id + ' #backArrow');
                    backArrow.show();
                    backArrow.on("click", function() { methods.back(a) })
                }

                if (sortField) {
                    var sortDiv = $('#' + s[0].id + ' #sortDiv');
                    sortDiv.show();
                    sortDiv.on('click', function() { methods.filterMenu(event, a) });
                }

                $('#' + s[0].id + ' .sortMenu li').first().on('click', $.proxy(function() { methods.sortTable(s, 'asc') }));
                $('#' + s[0].id + ' .sortMenu li').last().on('click', $.proxy(function() { methods.sortTable(s, 'desc') }));
                $('#' + s[0].id + ' .sort-bar label').last().on('click', $.proxy(function() { methods.sortMenu(event, a) }));

                //adding styles
                $('div.sort-bar').css(style["sort-bar"]);
                $('sort-bar text').css(style["sort-bar-text"]);
                $('.action-menu.second').css(style["action-menu-second"]);


                $('div.sortMenu.action-menu').css(style["action-menu"]);
                $('div.sortMenu.action-menu ul').css(style["action-menu-ul"]);
                $('div.sortMenu.action-menu li').css(style["action-menu-li"]);
                $('div.sortMenu.action-menu').css("width", "100px");

                //adding styles
                $('div.filterMenu.action-menu').css(style["action-menu"]);
                $('div.filterMenu.action-menu ul').css(style["action-menu-ul"]);
                $('div.filterMenu.action-menu li').css(style["action-menu-li"]);

                $('.action-menu .material-icons').css(style["action-menu-material-icons"]);

                return s

            },

            listCheck: function listCheck(e) {
                e = e.children[0].children[0];
                if (e.checked == true) {
                    e.parentElement.children["RadioBtn"].innerHTML = "radio_button_checked"
                    e.checked = true
                } else {
                    e.parentElement.children["RadioBtn"].innerHTML = "radio_button_unchecked"
                    e.checked = false
                }
                methods.filterTable();
            },

            sortTable: function(s, order) {
                s = $(s);
                var asc = order === 'asc',
                    tbody = s.find('tbody');

                tbody.find('tr').sort(function(a, b) {
                    if (asc) {
                        $('#AscBtn').html('radio_button_checked');
                        $('#DscBtn').html('radio_button_unchecked');
                        $('#sortMenu').hide();
                        return $('td:first', a).text().localeCompare($('td:first', b).text());
                    } else {
                        $('#AscBtn').html('radio_button_unchecked');
                        $('#DscBtn').html('radio_button_checked');
                        $('#sortMenu').hide();
                        return $('td:first', b).text().localeCompare($('td:first', a).text());
                    }
                }).appendTo(tbody);
            },

            filterTable: function(a) {
                //query #filerMenu DOM to see what is check
                var list = []

                $('.filterMenu li label span').each(
                    function(a, b) {
                        if (b.parentElement.children[0].checked == true) {
                            list.push(b.innerText)
                        }
                    }
                )

                $('#fbody tr td .cat').each(
                    function(a, b) {
                        if (list.indexOf(b.innerText) == -1) {

                            b.parentElement.parentElement.style.display = "none"
                        } else {
                            b.parentElement.parentElement.style.display = "table-row"
                        }
                    }
                )
            },

            filterMenu: function(event, a) {
                var divID = a;

                //check to see if div is a secondary menu within the tab, in which case the divs position must be absolute and top = 106px, and the filterMenu adjusted accordingly
                if (!isNaN($(divID).parent().css('top')[0])) {
                    $(divID + ' .filterMenu').show().css({ top: "2px", left: event.pageX - "300px" });
                } else {
                    $(divID + ' .filterMenu').show().css({ top: event.clientY - 66, left: event.pageX - "300px" });
                }


                if (!$(divID + '> div.action-menu.filterMenu.second > ul > li')[0]) {
                    Array.prototype.filter = function(field) {
                        var n = {},
                            r = [];
                        for (var i = 0; i < this.length; i++) {
                            if (!n[this[i][field]]) {
                                n[this[i][field]] = true;
                                r.push(this[i][field]);
                            }
                        }
                        r.splice(r.indexOf(null), 1)
                        r.sort();
                        //r.push("Other");
                        return r;
                    }
                    var unique = [];

                    unique = resultDivArray.filter('Type');

                    var maxlen = 0;
                    for (var i = 0; i < unique.length; i++) {
                        if (unique[i].length > maxlen) {
                            maxlen = unique[i].length;
                        }
                    }

                    $(divID + ' .filterMenu').css('width', (maxlen * 7) + 35);


                    function filterfunction(array) {

                        var menu = $(divID + " .filterMenu ul");
                        var a = [];
                        for (var i = 0; i < array.length; i++) {
                            if (a.indexOf(array[i]) == -1) {
                                a.push(array[i]);
                                menu.append('<li><label><input type="checkbox" checked><span>' + a[i] + '</span><i class="material-icons" id="RadioBtn">radio_button_checked</i></label></li>')
                                menu.children('li').last().on('click', $.proxy(function() { methods.listCheck(this) }))
                            }
                        }
                    }

                    filterfunction(unique);

                    //adding styles
                    $('div.filterMenu.action-menu ul').css(style["action-menu-ul"]);
                    $('div.filterMenu.action-menu li').css(style["action-menu-li"]);
                    $('.action-menu .material-icons').css(style["action-menu-material-icons"]);
                    $('.action-menu input').css(style["action-menu-input"]);
                }

                //applying styles
                $('div.filterMenu.action-menu li').css(style["action-menu-li"]);
                setTimeout(function() { $(document).on('click', methods.filterOff); }, 200);
                // var maxrow = $('#' + s[0].id + ' > div.action-menu.filterMenu.second > ul > li').length;
                // if (maxrow > 7) {
                //     $('.filterMenu').css({ "height": "256px", "overflow-y": "scroll", "overflow-x": "hidden" });
                //     //populateBuildingDiv(parkingDivArray);
                // } else {
                //     $('.filterMenu').css('height', maxrow * 36);
                // }8
            },

            sortMenu: function(event, a) {
                $(a + " .sortMenu").show();
                var divID = a;
                if (!isNaN($(divID).parent().css('top')[0])) {
                    $(divID + ' .sortMenu').show().css({ top: "2px", left: event.pageX - "150px" });
                } else {
                    $(divID + ' .sortMenu').show().css({ top: event.clientY - 66, left: event.pageX - "150px" });
                }


                setTimeout(function() { $(document).on('click', methods.sortOff); }, 200);
            },

            filterOff: function(event) {
                if (!$(event.target).closest('.filterMenu').length) {
                    if ($('.filterMenu').is(":visible")) {
                        $('.filterMenu').hide();
                        $(document).off("click", methods.filterOff);
                    }
                }
            },

            sortOff: function(event) {
                if (!$(event.target).closest('.sortMenu').length) {
                    if ($('.sortMenu').is(":visible")) {
                        $('.sortMenu').hide();
                        $(document).off("click", methods.sortOff);
                    }
                }
            },

            back: function(a) {
                $(a).parent().hide();
                $(a).parent().html('');
            }


        }
        methods["addTable"].apply(null, [this, options.url, options.nameField, options.sortField, options.back]);
    }
})