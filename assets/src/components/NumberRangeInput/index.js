/**
 * 数据范围选择器
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { InputNumber } from 'antd';

import styles from './index.less';

class NumberRangeInput extends Component {
  constructor(props) {
    super(props);
    if (props.defaultValue) {
      this.state = {
        value: [...props.defaultValue],
      };
    } else {
      this.state = {
        value: [undefined, undefined],
      };
    }
  }

  handleChange = data => {
    const { value, onChange } = this.props;
    if (data[0] > data[1]) {
      return;
    }
    if (value) {
      this.setState({ value: data });
    }
    if (onChange) {
      onChange(data);
    }
  };

  render() {
    const { className, style, key, onChange, value, ...otherProps } = this.props;
    const { value: stateValue } = this.state;
    const nowValue = value || stateValue || [];

    const cls = classNames(styles.numberRange, className);
    // { /* <Cascader */ }
    // { /* options={this.state.options} */ }
    // { /* loadData={this.loadData} */ }
    // { /* onChange={this.onChange} */ }
    // { /* style={style} */ }
    // { /* className={cls} */ }
    // { /* {...otherProps} */ }
    // { /* /> */ }
    return (
      <span className={cls}>
        <InputNumber
          value={nowValue[0]}
          style={style}
          {...otherProps}
          onChange={v => this.handleChange([v, nowValue[1]])}
        />
        <span> ~ </span>
        <InputNumber
          value={nowValue[1]}
          style={style}
          {...otherProps}
          onChange={v => this.handleChange([nowValue[0], v])}
        />
      </span>
    );
  }
}

export default NumberRangeInput;
