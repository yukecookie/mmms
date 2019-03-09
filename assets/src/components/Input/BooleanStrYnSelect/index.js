/**
 * author:  learnwy, Yang.Wang, 汪洋
 * time: 2018-01-31
 * feature: index
 * email: learnwy@gamil.com,yang.wang06@hand-china.com
 */
import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { formatMessage } from 'umi/locale';

// boolean ['Y','N'] 枚举
// 给Filter组件使用，最后可以通过 util handleQueryBooleanString2Boolean 方法 把字符串的值转换成对应的 boolean 值
export const BOOLEAN_ENUM_YES_CODE = 'Y';
export const BOOLEAN_ENUM_NO_CODE = 'N';
export const BooleanEnum = [
  { name: formatMessage({ id: 'app.site.yes' }), code: BOOLEAN_ENUM_YES_CODE },
  { name: formatMessage({ id: 'app.site.no' }), code: BOOLEAN_ENUM_NO_CODE },
];

const { Option } = Select;

const options = BooleanEnum.map(r => (
  <Option key={r.code} value={r.code}>
    {r.name}
  </Option>
));

/**
 * @description 用于 选项是 是/否 以及value为"Y"/"N" 的下拉框
 */
export default class BooleanStrYnSelect extends PureComponent {
  componentDidMount() {
    // 防止中英文切换后,这里没有切换
    BooleanEnum[0].name = formatMessage({ id: 'app.site.yes' });
    BooleanEnum[1].name = formatMessage({ id: 'app.site.no' });
  }

  render() {
    return <Select {...this.props}>{options}</Select>;
  }
}
