/**
 * 多条件组合
 */
import React, { Component } from 'react';
import { Input, Select } from 'antd';

const InputGroup = Input.Group;
// const { Option } = Select;

class SelectedInput extends Component {
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
    const { className, style, value = stateValue, key, onChange, ...otherProps } = this.props;
    return (
      <InputGroup compact>
        <Select
          value={value[0] || stateValue[0]}
          style={{ width: '50%' }}
          {...otherProps}
          onChange={v => this.handleChange([v, value[1]])}
        >
          <Select.Option value="greater">大于</Select.Option>
          <Select.Option value="equals">等于</Select.Option>
          <Select.Option value="less">小于</Select.Option>
        </Select>
        <Input
          disabled={!value[0] && !stateValue[0]}
          value={value[1]}
          style={{ width: '50%' }}
          {...otherProps}
          onChange={e => this.handleChange([value[0], e.target.value])}
        />
      </InputGroup>
    );
  }
}

export default SelectedInput;
