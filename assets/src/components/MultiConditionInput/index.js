/**
 * 多条件组合
 */
import React, { Component } from 'react';
import { Input, Select } from 'antd';

class MultiConditionInput extends Component {
  state = {
    value: ['equals', ''],
  };

  handleChange = data => {
    const { value, onChange } = this.props;
    if (!value) {
      this.setState({ value: data });
    }
    if (!data[0] && data[1]) {
      this.setState({ value: ['start', data[1]] }, () => {
        if (onChange) {
          onChange(['start', data[1]]);
        }
      });
    } else if (onChange) {
      onChange(data);
    }
  };

  render() {
    const { value: data } = this.state;
    const stateValue = data;
    const {
      className,
      style,
      value = stateValue,
      key,
      placeholder = '回车分隔多个数据',
      onChange,
      ...otherProps
    } = this.props;
    // { /* <Cascader */ }
    // { /* options={this.state.options} */ }
    // { /* loadData={this.loadData} */ }
    // { /* onChange={this.onChange} */ }
    // { /* style={style} */ }
    // { /* className={cls} */ }
    // { /* {...otherProps} */ }
    // { /* /> */ }
    return (
      <div>
        <Select
          value={value[0] || stateValue[0]}
          style={{ width: '100%' }}
          {...otherProps}
          onChange={v => this.handleChange([v, value[1]])}
        >
          <Select.Option value="start">始于</Select.Option>
          <Select.Option value="equals">等于</Select.Option>
          <Select.Option value="contains">包含</Select.Option>
        </Select>
        <Input.TextArea
          disabled={!value[0] && !stateValue[0]}
          value={value[1]}
          style={{ width: '100%', ...style }}
          placeholder={placeholder}
          // autosize={{ minRows: 1, maxRows: 6 }}
          {...otherProps}
          onChange={e => this.handleChange([value[0], e.target.value])}
          // addonBefore={
          // }
        />
      </div>
    );
  }
}

export default MultiConditionInput;
