# select3

自定义select插件，滚动条使用scrollbar插件，依赖jquery，提供单选以及多选功能，同时通过回调获取选项，多选返回逗号分隔的字符串

*option demo
*{
*	type: radio|check,
*	initValue: initvalue,初始化值
*	value: select option,所有选项
*	max: option is check, selecked max value,多选最大选择数量可选（）
*	autoClose: option is radio, option has click, auto close,单选是否选择选项就关闭，默认为false
*	callback: option is change, run it	回调方法，参数params返回选择的值，在关闭下拉框时触发
*	isImg: value is some img has data-name to save this name	是否为图片，图片下拉框的选项应该为img标签字符串
*	hasAll: true|false,	是否有all选项，默认为false
*	hasId: true|false, if true ,data and initValue should is [{name:.., id: ..}]	是否提供id，id存在时，名字可以不唯一
*}
*
![image](https://github.com/dtimmer/select3/blob/master/cc.png)

![image](https://github.com/dtimmer/select3/blob/master/dd.png)