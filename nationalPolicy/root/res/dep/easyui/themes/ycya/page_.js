(function($) {
	function _75(_76) {
		var _77 = $.data(_76, "pagination");
		var _78 = _77.options;
		var bb = _77.bb = {};
		var _79 = $(_76).addClass("pagination").html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tr></tr></table>");
		var tr = _79.find("tr");

		function _7a(_7b) {
			var btn = _78.nav[_7b];
			var a = $("<a href=\"javascript:void(0)\"></a>").appendTo(tr);
			a.wrap("<td></td>");
			a.linkbutton({
				iconCls: btn.iconCls,
				plain: true
			}).unbind(".pagination").bind("click.pagination", function () {
				btn.handler.call(_76);
			});
			return a;
		};
		if (_78.showPageList) {
			var ps = $("<select class=\"pagination-page-list\"></select>");
			ps.bind("change", function () {
				_78.pageSize = parseInt($(this).val());
				_78.onChangePageSize.call(_76, _78.pageSize);
				_7d(_76, _78.pageNumber);
			});
			for (var i = 0; i < _78.pageList.length; i++) {
				$("<option></option>").text(_78.pageList[i]).appendTo(ps);
			}
			$("<td></td>").append(ps).appendTo(tr);
			$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
		}
		bb.first = _7a("first");
		bb.prev = _7a("prev");
		$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
		$("<span style=\"padding-left:6px;\"></span>").html(_78.beforePageText).appendTo(tr).wrap("<td></td>");
		bb.num = $("<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">").appendTo(tr).wrap("<td></td>");
		bb.num.unbind(".pagination").bind("keydown.pagination", function (e) {
			if (e.keyCode == 13) {
				var _7c = parseInt($(this).val()) || 1;
				_7d(_76, _7c);
				return false;
			}
		});
		bb.after = $("<span style=\"padding-right:6px;\"></span>").appendTo(tr).wrap("<td></td>");
		$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
		bb.next = _7a("next");
		bb.last = _7a("last");
		if (_78.showRefresh) {
			$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
			bb.refresh = _7a("refresh");
		}
		if (_78.buttons) {
			$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
			for (var i = 0; i < _78.buttons.length; i++) {
				var btn = _78.buttons[i];
				if (btn == "-") {
					$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
				} else {
					var td = $("<td></td>").appendTo(tr);
					$("<a href=\"javascript:void(0)\"></a>").appendTo(td).linkbutton($.extend(btn, {
						plain: true
					})).bind("click", eval(btn.handler || function () {
						}));
				}
			}
		}
		$("<div class=\"pagination-info\"></div>").appendTo(_79);
		$("<div style=\"clear:both;\"></div>").appendTo(_79);
	};

	function _7d(_7e, _7f) {
		var _80 = $.data(_7e, "pagination").options;
		var _81 = Math.ceil(_80.total / _80.pageSize) || 1;
		_80.pageNumber = _7f;
		if (_80.pageNumber < 1) {
			_80.pageNumber = 1;
		}
		if (_80.pageNumber > _81) {
			_80.pageNumber = _81;
		}
		_82(_7e, {
			pageNumber: _80.pageNumber
		});
		_80.onSelectPage.call(_7e, _80.pageNumber, _80.pageSize);
	};

	function _82(_83, _84) {
		var _85 = $.data(_83, "pagination").options;
		var bb = $.data(_83, "pagination").bb;
		$.extend(_85, _84 || {});
		var ps = $(_83).find("select.pagination-page-list");
		if (ps.length) {
			ps.val(_85.pageSize + "");
			_85.pageSize = parseInt(ps.val());
		}
		var _86 = Math.ceil(_85.total / _85.pageSize) || 1;
		bb.num.val(_85.pageNumber);
		bb.after.html(_85.afterPageText.replace(/{pages}/, _86));
		var _87 = _85.displayMsg;
		_87 = _87.replace(/{from}/, _85.total == 0 ? 0 : _85.pageSize * (_85.pageNumber - 1) + 1);
		_87 = _87.replace(/{to}/, Math.min(_85.pageSize * (_85.pageNumber), _85.total));
		_87 = _87.replace(/{total}/, _85.total);
		$(_83).find("div.pagination-info").html(_87);
		bb.first.add(bb.prev).linkbutton({
			disabled: (_85.pageNumber == 1)
		});
		bb.next.add(bb.last).linkbutton({
			disabled: (_85.pageNumber == _86)
		});
		_88(_83, _85.loading);
	};

	function _88(_89, _8a) {
		var _8b = $.data(_89, "pagination").options;
		var bb = $.data(_89, "pagination").bb;
		_8b.loading = _8a;
		if (_8b.showRefresh) {
			if (_8b.loading) {
				bb.refresh.linkbutton({
					iconCls: "pagination-loading"
				});
			} else {
				bb.refresh.linkbutton({
					iconCls: "pagination-load"
				});
			}
		}
	};
	$.fn.pagination = function (_8c, _8d) {
		if (typeof _8c == "string") {
			return $.fn.pagination.methods[_8c](this, _8d);
		}
		_8c = _8c || {};
		return this.each(function () {
			var _8e;
			var _8f = $.data(this, "pagination");
			if (_8f) {
				_8e = $.extend(_8f.options, _8c);
			} else {
				_8e = $.extend({}, $.fn.pagination.defaults, $.fn.pagination.parseOptions(this), _8c);
				$.data(this, "pagination", {
					options: _8e
				});
			}
			_75(this);
			_82(this);
		});
	};
	$.fn.pagination.methods = {
		options: function (jq) {
			return $.data(jq[0], "pagination").options;
		},
		loading: function (jq) {
			return jq.each(function () {
				_88(this, true);
			});
		},
		loaded: function (jq) {
			return jq.each(function () {
				_88(this, false);
			});
		},
		refresh: function (jq, _90) {
			return jq.each(function () {
				_82(this, _90);
			});
		},
		select: function (jq, _91) {
			return jq.each(function () {
				_7d(this, _91);
			});
		}
	};
	$.fn.pagination.parseOptions = function (_92) {
		var t = $(_92);
		return $.extend({}, $.parser.parseOptions(_92, [{
			total: "number",
			pageSize: "number",
			pageNumber: "number"
		}, {
			loading: "boolean",
			showPageList: "boolean",
			showRefresh: "boolean"
		}]), {
			pageList: (t.attr("pageList") ? eval(t.attr("pageList")) : undefined)
		});
	};
	$.fn.pagination.defaults = {
		total: 1,
		pageSize: 10,
		pageNumber: 1,
		pageList: [10, 20, 30, 50],
		loading: false,
		buttons: null,
		showPageList: true,
		showRefresh: true,
		onSelectPage: function (_93, _94) {
		},
		onBeforeRefresh: function (_95, _96) {
		},
		onRefresh: function (_97, _98) {
		},
		onChangePageSize: function (_99) {
		},
		beforePageText: "Page",
		afterPageText: "of {page}",
		displayMsg: "Displaying {from} to {to} of {total} items",
		nav: {
			first: {
				iconCls: "pagination-first",
				handler: function () {
					var _9a = $(this).pagination("options");
					if (_9a.pageNumber > 1) {
						$(this).pagination("select", 1);
					}
				}
			},
			prev: {
				iconCls: "pagination-prev",
				handler: function () {
					var _9b = $(this).pagination("options");
					if (_9b.pageNumber > 1) {
						$(this).pagination("select", _9b.pageNumber - 1);
					}
				}
			},
			next: {
				iconCls: "pagination-next",
				handler: function () {
					var _9c = $(this).pagination("options");
					var _9d = Math.ceil(_9c.total / _9c.pageSize);
					if (_9c.pageNumber < _9d) {
						$(this).pagination("select", _9c.pageNumber + 1);
					}
				}
			},
			last: {
				iconCls: "pagination-last",
				handler: function () {
					var _9e = $(this).pagination("options");
					var _9f = Math.ceil(_9e.total / _9e.pageSize);
					if (_9e.pageNumber < _9f) {
						$(this).pagination("select", _9f);
					}
				}
			},
			refresh: {
				iconCls: "pagination-refresh",
				handler: function () {
					var _a0 = $(this).pagination("options");
					if (_a0.onBeforeRefresh.call(this, _a0.pageNumber, _a0.pageSize) != false) {
						$(this).pagination("select", _a0.pageNumber);
						_a0.onRefresh.call(this, _a0.pageNumber, _a0.pageSize);
					}
				}
			}
		}
	};
})
