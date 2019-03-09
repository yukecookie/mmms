/**
 * author:  learnwy, Yang.Wang, 汪洋
 * time: 2018-01-31
 * feature: index
 * email: learnwy@gamil.com,yang.wang06@hand-china.com
 */
import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { formatMessage } from 'umi/locale';

const { Option } = Select;
/**
 * 组件实际上 value 为 ture 的字符串 是 'yes'
 * @type {string}
 */
export const BOOLEAN_ENUM_YES_CODE = 'yes';

/**
 * 组件实际上 value 为 false 的字符串 是 'no'
 * @type {string}
 */
export const BOOLEAN_ENUM_NO_CODE = 'no';
/**
 * 组件显示的值
 * @type {[{name:string,code:string}]}
 */
export const BooleanEnum = [
  { name: formatMessage({ id: 'app.site.yes' }), code: BOOLEAN_ENUM_YES_CODE },
  { name: formatMessage({ id: 'app.site.no' }), code: BOOLEAN_ENUM_NO_CODE },
];
const options = BooleanEnum.map(r => (
  <Option key={r.code} value={r.code}>
    {r.name}
  </Option>
));
/**
 * @desc 用于 选项是 是/否 以及value为Boolean 的下拉框
 * @param {{value:Boolean,defaultValue:Boolean,onChange:Function,onSelect:Function,...otherSelectedProps: Object}} - boolean 下拉框 组件
 * @example
 * const props = { successFlag:false };
 * <BooleanSelect
 *  allowClear
 *  defaultValue={ props.successFlag }
 *  onChange={ (successFlag)=>{
 *      props.successFlag = successFlag;
 *  }}
 *  >
 *  </BooleanSelect>
 *
 */
export default class BooleanSelect extends PureComponent {
  componentDidMount() {
    // 防止中英文切换后,这里没有切换
    BooleanEnum[0].name = formatMessage({ id: 'app.site.yes' });
    BooleanEnum[1].name = formatMessage({ id: 'app.site.no' });
  }

  render() {
    const { value, defaultValue, onChange, onSelect } = this.props;
    let booleanSelectOps = {};
    switch (value) {
      case true:
        booleanSelectOps.value = BOOLEAN_ENUM_YES_CODE;
        break;
      case false:
        booleanSelectOps.value = BOOLEAN_ENUM_NO_CODE;
        break;
      default:
        booleanSelectOps.value = undefined;
        break;
    }
    switch (defaultValue) {
      case true:
        booleanSelectOps.defaultValue = BOOLEAN_ENUM_YES_CODE;
        break;
      case false:
        booleanSelectOps.defaultValue = BOOLEAN_ENUM_NO_CODE;
        break;
      default:
        booleanSelectOps.defaultValue = undefined;
        break;
    }
    if (onChange) {
      booleanSelectOps.onChange = v => {
        let changeValue;
        switch (v) {
          case BOOLEAN_ENUM_YES_CODE:
            changeValue = true;
            break;
          case BOOLEAN_ENUM_NO_CODE:
            changeValue = false;
            break;
          default:
            changeValue = undefined;
            break;
        }
        onChange(changeValue);
      };
    }
    if (onSelect) {
      booleanSelectOps.onSelect = (v, option) => {
        let changeValue;
        switch (v) {
          case BOOLEAN_ENUM_YES_CODE:
            changeValue = true;
            break;
          case BOOLEAN_ENUM_NO_CODE:
            changeValue = false;
            break;
          default:
            changeValue = undefined;
            break;
        }
        onChange(changeValue, option);
      };
    }
    booleanSelectOps = { ...this.props, ...booleanSelectOps };
    return <Select {...booleanSelectOps}>{options}</Select>;
  }
}
