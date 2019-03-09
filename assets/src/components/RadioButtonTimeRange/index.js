/**
 * 时间多选按钮选择器
 */
import React, { Component } from 'react';
import moment from 'moment';
import { Radio, Icon, DatePicker, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;

class RadioButtonTimeRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderFlag: false,
      radioValue: '',
      iconDisabled: false,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (!nextProps.value || nextProps.value.length === 0) {
      this.setState({
        radioValue: '',
      });
    }
  }

  setField = days => {
    const { onChange } = this.props;
    const now = moment();
    const ago = moment().subtract(Number(days), 'days');
    if (onChange) {
      onChange([ago, now]);
    }
    const radioValue = `${now.diff(ago) / (24 * 60 * 60 * 1000)}`;
    this.setState({ radioValue });
  };

  changeState = flagName => {
    const { orderFlag } = this.state;
    this.setState({
      [flagName]: !orderFlag,
    });
  };

  render() {
    const { orderFlag, iconDisabled, radioValue: stateRadioValue } = this.state;
    const {
      getCalendarContainer,
      onChange,
      value = [],
      showTime = false,
      format = 'YYYY-MM-DD HH:mm:ss',
    } = this.props;
    return (
      <div>
        <Row>
          <FormItem>
            {
              <RangePicker
                showTime={showTime}
                format={format}
                placeholder={[
                  formatMessage({ id: 'app.filter.text_startDate' }),
                  formatMessage({ id: 'app.filter.text_endDate' }),
                ]}
                value={value}
                onChange={value1 => {
                  if (onChange) {
                    if (value1.length === 0) {
                      const radioValue = '';
                      this.setState({ radioValue });
                      onChange(value1);
                    } else {
                      const radioValue = `${value1[1].diff(value1[0]) / (24 * 60 * 60 * 1000)}`;
                      this.setState({ radioValue });
                      onChange(value1);
                      // console.log(radioValue);
                      // if (radioValue !== '10' && radioValue !== '30' && radioValue !== '90') {
                      //   // console.log('test');
                      //   this.setState({ iconDisabled: true });
                      // }
                    }
                  }
                }}
                getCalendarContainer={getCalendarContainer}
              />
            }
          </FormItem>
          <Icon
            type={orderFlag ? 'up' : 'down'}
            onClick={() => this.changeState('orderFlag')}
            style={{ marginLeft: '4px' }}
            disabled={iconDisabled}
          />
        </Row>
        <Row>
          {orderFlag && (
            <RadioGroup
              allowClear
              style={{ marginLeft: 4 }}
              onChange={e => this.setField(e.target.value)}
              value={stateRadioValue}
            >
              <RadioButton value="10">
                {formatMessage({ id: 'app.filter.radioButtonTimeRange.text_timeSpan1' })}
              </RadioButton>
              <RadioButton value="30">
                {formatMessage({ id: 'app.filter.radioButtonTimeRange.text_timeSpan2' })}
              </RadioButton>
              <RadioButton value="90">
                {formatMessage({ id: 'app.filter.radioButtonTimeRange.text_timeSpan3' })}
              </RadioButton>
            </RadioGroup>
          )}
        </Row>
      </div>
    );
  }
}

export default RadioButtonTimeRange;
