import analysis from './zh-CN/analysis';
import exception from './zh-CN/exception';
import form from './zh-CN/form';
import globalHeader from './zh-CN/globalHeader';
import login from './zh-CN/login';
import menu from './zh-CN/menu';
import monitor from './zh-CN/monitor';
import result from './zh-CN/result';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pwa from './zh-CN/pwa';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.home.introduce': '介绍',
  'app.forms.basic.title': '基础表单',
  'app.forms.basic.description':
    '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
  'app.forms.replace.title': '会员换卡',
  'app.forms.replace.description': '会员卡损坏或条形码模糊不清',
  'app.forms.charge.title': '会员卡充值',
  'app.forms.charge.description': '增加会员卡中的金额',
  'app.forms.lost.title': '会员卡挂失',
  'app.forms.lost.description':
    '当会员丢失会员卡后，为了避免出现意外，会员本人可以申请会员卡挂失，防止被他人非法使用',
  'app.forms.lock.title': '会员卡锁定',
  'app.forms.lock.description':
    '当会员发生了影响商场正常经营活动的行为时，商场可以禁止该会员卡的使用。',
  'app.forms.addInfo.title': '添加消费信息',
  'app.forms.addInfo.description': '添加消费信息以计算用户类型',
  'app.forms.refund.title': '消费退款',
  'app.forms.refund.description': '确保退款商品不影响干净销售',
  // '': '',

  'app.list.message_hasChoosePart1': '已选择', // list
  'app.list.message_hasChoosePart2': '项',
  'app.list.btn_clear': '清空',

  'app.filter.text_pleaseChoose': '请输入', // filter
  'app.filter.select_pleaseChoose': '请选择',
  'app.filter.message_noData': '没有相应的数据',
  'app.filter.text_startDate': '开始日期',
  'app.filter.text_endDate': '结束日期',
  'app.filter.btn_search': '查询',
  'app.filter.btn_reset': '重置',
  'app.filter.radioButtonTimeRange.text_timeSpan1': '10天',
  'app.filter.radioButtonTimeRange.text_timeSpan2': '1个月',
  'app.filter.radioButtonTimeRange.text_timeSpan3': '3个月',
  'app.site.tableShowTotal': '共 {total} 条记录  当前第 {rangeStart} - {rangeEnd} 条',
  'app.site.yes': '是',
  'app.site.no': '否',

  'app.list.title': '保存', //
  'app.list.submit': '提交', //
  ...analysis,
  ...exception,
  ...form,
  ...globalHeader,
  ...login,
  ...menu,
  ...monitor,
  ...result,
  ...settingDrawer,
  ...settings,
  ...pwa,
};
