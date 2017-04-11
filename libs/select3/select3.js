//该组件依赖于jquery,加载该组件之前请先引入jquery文件
//该组件不支持低版本浏览器

/**
 * select3实例化组件
 * @param {Object} dom	初始化dom节点(唯一)
 */
function Select3(dom) {
	this._dom = dom;
	this.childNode = '<div class="select3_input"></div>' +
		'<div class="select3_options">' +
		'<div class="select3_scroll">' +
		'<ul></ul>' +
		'</div>' +
		'</div>' + '<div style="display: none;" class="select_clear">x</div>';
	this.oldValue = null;
}

Select3.prototype.setOption = function(option) {
	var _this = this;
	$(this._dom).html('');
	$(this._dom).addClass('select3');
	$(this._dom).css('position', 'relative');
	if (!option.type) {
		throw new Error('please set a true option!');
	}
	if (!option.value || !(option.value instanceof Array)) {
		throw new Error('option should have true values!');
	}
	$(this._dom).append($(this.childNode));
	if(option.hasClear) {
		$(this._dom).find('.select_clear').show();
	}
	if(option.hasAll) {
		$(_this._dom).find('ul').append($(`<li class="all" title="ALL">ALL</li>`));
	}
	if(option.hasId) {
		option.value.forEach(function(v, i) {
			var li = $(`<li class="child_li" data-id="${v.id}" title="${v.name}">${v.name}</li>`);
			$(_this._dom).find('ul').append(li);
		});
	} else {
		option.value.forEach(function(v, i) {
			var li = $(`<li class="child_li" title="${v}">${v}</li>`);
			$(_this._dom).find('ul').append(li);
		});
	}
	$(this._dom).find('.select3_scroll').css('height', `${0.36 * option.value.length + 0.05}rem`);
	$(this._dom).find('.select3_scroll').mCustomScrollbar({
		axis: "xy"
	});
	if (option.type == 'check') {
		$(this._dom).find('.select3_options').addClass('checks');
		if (option.initValue) {
			if(option.hasId) {
				var initArr = ObjCopy(option.initValue);
				initArr.forEach(function(v, i) {
					$(_this._dom).find('li').each(function(index, value) {
						if ($(this).attr('data-id') == v.id) {
							$(this).addClass('sel');
						}
					});
				});
			} else {
				var initArr = ObjCopy(option.initValue);
				if(initArr[0] == 'ALL') {
					$(_this._dom).find('li').each(function(index, value) {
						$(this).addClass('sel');
					});
				} else {
					initArr.forEach(function(v, i) {
						$(_this._dom).find('li').each(function(index, value) {
							if ($(this).text() == v) {
								$(this).addClass('sel');
							}
						});
					});
					var all_sel = true;
					$(_this._dom).find('.child_li').each(function(index, value) {
						if(!$(value).hasClass('sel')) {
							all_sel = false;
						}
					});
					if(all_sel) {
						$(_this._dom).find('.all').addClass('sel');
					}
				}
			}
		}
	}
	if (option.isImg) {
		$(_this._dom).find('.select3_input').append($(option.initValue));
	} else if(option.hasId) {
		var show_arr = [];
		option.initValue.forEach(function(v, i) {
			show_arr.push(v.name);
		});
		$(_this._dom).find('.select3_input').text(show_arr);
		$(_this._dom).find('.select3_input').attr('title', show_arr);
		if(option.type == 'radio') {
			$(_this._dom).find('.select3_input').attr('data-data', JSON.stringify(option.initValue[0]));
		} else {
			$(_this._dom).find('.select3_input').attr('data-data', JSON.stringify(option.initValue));
		}
	} else {
		$(_this._dom).find('.select3_input').text(option.initValue);
		$(_this._dom).find('.select3_input').attr('title', option.initValue);
		if(option.initValue[0] == 'ALL') {
			var show_title = [];
			$(_this._dom).find('.child_li').each(function(index, value) {
				show_title.push($(this).text());
			});
			$(_this._dom).find('.select3_input').attr('title', show_title.join(','));
		}
	}
	if(option.type == 'radio') {
		this.oldValue = JSON.stringify(option.initValue[0]);
	} else {
		this.oldValue = JSON.stringify(option.initValue);
	}
	//事件绑定
	$(this._dom).off();
	$(this._dom).on('click', function(e) {
		e.stopPropagation();
		if (!$(e.target).hasClass('select3_input')) {
			return;
		}
		if ($(_this._dom).find('.select3_options').hasClass('show')) {
			if ($(_this._dom).find('.select3_options').hasClass('show') && option.callback) {
				if (option.isImg) {
					var select_value = $(_this._dom).find('.select3_input').find('img').attr('data-name');
				} else if(option.hasId) {
					var select_value = $(_this._dom).find('.select3_input').attr('data-data');
				} else {
					var select_value = $(_this._dom).find('.select3_input').text();
				}
				if (_this.oldValue != select_value) {
					option.callback(select_value);
					_this.oldValue = select_value;
				}
			}
			$(_this._dom).find('.select3_options').removeClass('show');
			$(_this._dom).find('.select3_input').removeClass('show');
		} else {
			if ($(_this._dom).find('.select3_options').hasClass('show') && option.callback) {
				if (option.isImg) {
					var select_value = $(_this._dom).find('.select3_input').find('img').attr('data-name');
				} else if(option.hasId) {
					var select_value = $(_this._dom).find('.select3_input').attr('data-data');
				} else {
					var select_value = $(_this._dom).find('.select3_input').text();
				}
				if (_this.oldValue != select_value) {
					option.callback(select_value);
					_this.oldValue = select_value;
				}
			}
			$(_this._dom).find('.select3_options').addClass('show');
			$(_this._dom).find('.select3_input').addClass('show');
		}
	});
	$(this._dom).on('click', '.select_clear', function() {
		if(option.type == 'check') {
			$(_this._dom).find('.child_li.sel').click();
		}
	});
	
	$(this._dom).on('click', 'li.child_li', function(e) {
		e.stopPropagation();
		if (option.type == 'radio') {
			if (option.isImg) {
				$(_this._dom).find('.select3_input').html($(this).html());
			} else if(option.hasId) {
				$(_this._dom).find('.select3_input').text($(this).text());
				$(_this._dom).find('.select3_input').attr("data-data", `{"id":"${$(this).attr('data-id')}","name":"${$(this).text()}"}`);
				$(_this._dom).find('.select3_input').attr('title', $(this).text());
			} else {
				$(_this._dom).find('.select3_input').text($(this).text());
				$(_this._dom).find('.select3_input').attr('title', $(this).text());
			}
			if (option.autoClose) {
				if ($(_this._dom).find('.select3_options').hasClass('show') && option.callback) {
					if(option.isImg) {
						var select_value = $(_this._dom).find('.select3_input').find('img').attr('data-name');
					} else if(option.hasId) {
						var select_value = $(_this._dom).find('.select3_input').attr('data-data');
					} else {
						var select_value = $(_this._dom).find('.select3_input').text();
					}
					if (_this.oldValue != select_value) {
						option.callback(select_value);
						_this.oldValue = select_value;
					}
				}
				$('.select3_options').removeClass('show');
				$('.select3_input').removeClass('show');
			}
		} else {
			if ($(this).hasClass('sel')) {
				$(this).removeClass('sel');
				$(_this._dom).find('all').removeClass('all');
			} else {
				if ($(_this._dom).find('.sel').length >= option.max && !option.hasAll) {
					return;
				}
				$(this).addClass('sel');
			}
			var all_sel = true;
			var textArr = [];
			if(option.hasId) {
				var tempArr = [];
				$(_this._dom).find('.child_li').each(function(i, v) {
					if($(this).hasClass('sel')) {
						var temp = {};
						temp.id = $(v).attr('data-id');
						temp.name = $(v).text()
						textArr.push($(v).text());
						tempArr.push(temp);
					} else {
						all_sel = false;
					}
				});
				if(all_sel) {
					if(option.hasAll) {
						$(_this._dom).find('.all').addClass('sel');
						$(_this._dom).find('.select3_input').text('ALL');
					} else {
						$(_this._dom).find('.select3_input').text(textArr.join(','));
					}
					$(_this._dom).find('.select3_input').attr('title', textArr.join(','));
					$(_this._dom).find('.select3_input').attr('data-data', JSON.stringify(tempArr));
				} else {
					$(_this._dom).find('.all').removeClass('sel');
					$(_this._dom).find('.select3_input').text(textArr.join(','));
					$(_this._dom).find('.select3_input').attr('title', textArr.join(','));
					$(_this._dom).find('.select3_input').attr('data-data', JSON.stringify(tempArr));
				}
			} else {
				$(_this._dom).find('.child_li').each(function(i, v) {
					if($(this).hasClass('sel')) {
						textArr.push($(v).text());
					} else {
						all_sel = false;
					}
				})
				if(all_sel) {
					if(option.hasAll) {
						$(_this._dom).find('.all').addClass('sel');
						$(_this._dom).find('.select3_input').text('ALL');
					} else {
						$(_this._dom).find('.select3_input').text(textArr.join(','));
					}
					$(_this._dom).find('.select3_input').attr('title', textArr.join(','));
				} else {
					$(_this._dom).find('.all').removeClass('sel');
					$(_this._dom).find('.select3_input').text(textArr.join(','));
					$(_this._dom).find('.select3_input').attr('title', textArr.join(','));
				}
			}
		}
	});
	$(this._dom).on('click', 'li.all', function(e) {
		e.stopPropagation();
		if($(this).hasClass('sel')) {
			$(this).parent().find('li').removeClass('sel');
			$(_this._dom).find('.select3_input').text('');
			$(_this._dom).find('.select3_input').attr('');
		} else {
			$(this).parent().find('li').addClass('sel');
			var tempArr = [];
			$(_this._dom).find('.child_li.sel').each(function(i, v) {
				tempArr.push($(v).text());
			});
			$(_this._dom).find('.select3_input').text('ALL');
			$(_this._dom).find('.select3_input').attr('title', tempArr.join(','));
		}
	});
//	$('body').off();
	$('body').on('click', function(e) {
		if ($(_this._dom).find('.select3_options').hasClass('show') && option.callback) {
			if (option.isImg) {
				var select_value = $(_this._dom).find('.select3_input').find('img').attr('data-name');
			} else if(option.hasId) {
				var select_value = $(_this._dom).find('.select3_input').attr('data-data');
			} else {
				var select_value = $(_this._dom).find('.select3_input').text();
			}
			if (_this.oldValue != select_value) {
				option.callback(select_value);
				_this.oldValue = select_value;
			}
		}
		$(_this._dom).find('.select3_options').removeClass('show');
		$(_this._dom).find('.select3_input').removeClass('show');
	});
}

//select3接口
window.select3 = {
	init: function(dom) {
		if (!dom || !dom.toString().indexOf('HTMLDivElement')) {
			throw new Error('dom is not find!');
		}
		return new Select3(dom);
	}
}

//option demo
//{
//	type: radio|check,
//	initValue: initvalue,
//	value: select option,
//	max: option is check, selecked max value,
//	autoClose: option is radio, option has click, auto close,
//	callback: option is change, run it
//	isImg: value is some img has data-name to save this name
//	hasAll: true|false,
//	hasId: true|false, if true ,data and initValue should is [{name:.., id: ..}]
//	hasClear: true|false, if true, add x to clear all select
//}