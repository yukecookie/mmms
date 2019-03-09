/**
 * author:  learnwy, Yang.Wang, 汪洋
 * time: 2018-02-23
 * feature: index
 * email: learnwy@gamil.com,yang.wang06@hand-china.com
 */

import React, { PureComponent } from 'react';
import { Input } from 'antd';

export default class NameValueInput extends PureComponent {
  render() {
    const { value, defaultValue, onChange, ...otherOps } = this.props;
    const inputOps = { ...otherOps };
    if (value) {
      inputOps.value = value.name;
    } else {
      inputOps.value = undefined;
    }
    if (defaultValue) {
      inputOps.defaultValue = defaultValue.name;
    } else {
      inputOps.defaultValue = undefined;
    }
    if (onChange) {
      inputOps.onChange = v => {
        onChange(v);
      };
    }

    return <Input {...inputOps} />;
  }
}
