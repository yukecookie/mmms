/* eslint-disable react/no-array-index-key, consistent-return, no-nested-ternary, react/jsx-indent, import/no-cycle */
/**
 * Created by yunqiang.wu on 7/9/2017.
 *
 * 通用查询过滤
 */
import { formatMessage } from 'umi/locale';
import React, { PureComponent } from 'react';
import {
  Form,
  Checkbox,
  Select,
  Input,
  Row,
  Col,
  DatePicker,
  Radio,
  Button,
  Cascader,
  InputNumber,
} from 'antd';
import styles from './style.less';
import FormModal from './FormModal';
import BooleanSelect from '../Input/BooleanSelect';
import { getContentScrollContainer } from '../../utils/utils';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

const defaultFormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const gridRowProps = {
  md: 2,
  lg: 4,
  xl: 12,
};
const gridColProps = {
  5: {
    lg: 4,
    md: 8,
    sm: 24,
  },
  4: {
    lg: 6,
    md: 8,
    sm: 24,
  },
  3: {
    lg: 8,
    md: 8,
    sm: 24,
  },
  2: {
    lg: 12,
    md: 12,
    sm: 24,
  },
  1: {
    lg: 24,
    md: 24,
    sm: 24,
  },
};

class InputGroups extends PureComponent {
  componentDidMount() {}

  render() {
    const {
      inputItems,
      rowType,
      formItemLayout = defaultFormItemLayout,
      col = 4,
      form,
      form: { getFieldDecorator },
    } = this.props;

    const inputGroupEles = [];
    inputItems.forEach((inputItem, filterIndex) => {
      if (!inputItem) {
        return;
      }

      if (inputItem.hide) {
        if (typeof inputItem.hide === 'function') {
          if (inputItem.hide(form)) {
            return;
          }
        }
        if (inputItem.hide === true) {
          return;
        }
      }

      const currentFormItemLayout = inputItem.formItemLayout || formItemLayout;
      const help = inputItem.helpProps;
      let currentColProps = gridColProps[inputItem.col || col];

      if (inputItem.onlyShow) {
        return (
          <Col
            {...currentColProps}
            key={`filterItem_${filterIndex}`}
            style={{ marginTop: '8px', ...inputItem.colStyle }}
          >
            <FormItem
              colon
              label={inputItem.name}
              style={{ width: '100%' }}
              {...currentFormItemLayout}
              {...help}
            >
              {inputItem.value || formatMessage({ id: 'app.inputGroups.text_tempEmpty' })}
            </FormItem>
          </Col>
        );
      }
      let inputComponent;
      const fieldDecorator = {
        initialValue: inputItem.value,
        rules: inputItem.rules,
      };
      switch (inputItem.type) {
        case 'select':
          inputComponent = (
            <Select
              filterOption={(inputValue, option) =>
                option.props.children.includes(inputValue) ||
                option.props.value.includes(inputValue)
              }
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value, form);
                }
              }}
              allowClear
              placeholder={formatMessage({ id: 'app.filter.select_pleaseChoose' })}
              key={`select_${filterIndex}`}
              style={{ width: '100%', fontSize: 13 }}
              getPopupContainer={getContentScrollContainer}
              {...inputItem.inputProps}
            >
              {inputItem.renderDataSourceOption
                ? inputItem.renderDataSourceOption(inputItem.dataSource)
                : inputItem.dataSource.map(item => {
                    const code = `${item[inputItem.dataSourceValueField || 'code']}`;
                    const name = item[inputItem.dataSourceNameField || 'name'] || code;
                    return (
                      <Option key={`opt_${code}`} value={code}>
                        {name}
                      </Option>
                    );
                  })}
            </Select>
          );
          break;
        case 'checkbox':
          fieldDecorator.valuePropName = 'checked';
          inputComponent = (
            <Checkbox
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value.target.checked, form);
                }
              }}
              {...inputItem.inputProps}
            />
          );
          break;
        case 'bool-select':
          inputComponent = (
            <BooleanSelect
              filterOption={(inputValue, option) =>
                option.props.children.includes(inputValue) ||
                option.props.value.includes(inputValue)
              }
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value, form);
                }
              }}
              allowClear
              placeholder={formatMessage({ id: 'app.filter.select_pleaseChoose' })}
              key={`bool-select_${filterIndex}`}
              style={{ width: '100%', fontSize: 13 }}
              getPopupContainer={getContentScrollContainer}
              {...inputItem.inputProps}
            />
          );
          break;
        case 'input-number':
          inputComponent = (
            <InputNumber
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value, form);
                }
              }}
              formatter={inputItem.formatter === '%' ? value => `${value}%` : value} // eslint-disable-line
              parser={inputItem.formatter === '%' ? value => value.replace('%', '') : value} // eslint-disable-line
              {...inputItem.inputProps}
            />
          );
          break;
        case 'button':
          inputComponent = (
            <Button
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value.target.checked, form);
                }
              }}
            />
          );
          break;
        case 'date':
          inputComponent = (
            <DatePicker
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value.target.checked, form);
                }
              }}
              style={{ width: '100%' }}
              getCalendarContainer={getContentScrollContainer}
              {...inputItem.inputProps}
            />
          );
          break;
        case 'range-picker':
          inputComponent = (
            <RangePicker
              placeholder={[
                formatMessage({ id: 'app.filter.text_startDate' }),
                formatMessage({ id: 'app.filter.text_endDate' }),
              ]}
              {...inputItem.inputProps}
              getCalendarContainer={getContentScrollContainer}
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value.target.value, form);
                }
              }}
            />
          );
          break;
        case 'cascader':
          inputComponent = (
            <Cascader
              data-code={inputItem.field}
              // defaultValue={['省', '市','区']}
              options={inputItem.options}
              getPopupContainer={getContentScrollContainer}
              {...inputItem.inputProps}
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value.target.value, form);
                }
              }}
            />
          );
          break;
        case 'radio':
          inputComponent = (
            <RadioGroup
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value, form);
                }
              }}
              allowClear
              key={`select_${filterIndex}`}
              style={{ marginLeft: 4 }}
              {...inputItem.inputProps}
            >
              {inputItem.renderDataSourceOption
                ? inputItem.renderDataSourceOption(inputItem.dataSource)
                : inputItem.dataSource.map(item => (
                    <Radio
                      key={`opt_${item[inputItem.dataSourceValueField || 'value']}`}
                      value={`${item[inputItem.dataSourceValueField || 'value']}`}
                    >
                      {item[inputItem.dataSourceNameField || 'text']}
                    </Radio>
                  ))}
            </RadioGroup>
          );
          break;
        case 'textArea':
          inputComponent = (
            <Input.TextArea
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value, form);
                }
              }}
              placeholder={formatMessage({ id: 'app.filter.text_pleaseInput' })}
              key={`input_${filterIndex}`}
              style={{ fontSize: 13 }}
              {...inputItem.inputProps}
            />
          );
          break;
        case 'password':
          inputComponent = inputItem.name ? (
            <Input
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value, form);
                }
              }}
              placeholder={
                inputItem.placeholder ||
                inputItem.name ||
                formatMessage({ id: 'app.filter.text_pleaseInput' })
              }
              key={`input_${filterIndex}`}
              style={{ fontSize: 13 }}
              {...inputItem.inputProps}
            />
          ) : (
            false
          );
          break;
        default:
          inputComponent = inputItem.name ? (
            <Input
              onChange={value => {
                if (inputItem.onChange) {
                  inputItem.onChange(value, form);
                }
              }}
              placeholder={
                inputItem.placeholder ||
                inputItem.name ||
                formatMessage({ id: 'app.filter.text_pleaseInput' })
              }
              key={`input_${filterIndex}`}
              style={{ fontSize: 13 }}
              {...inputItem.inputProps}
            />
          ) : (
            false
          );
          break;
      }
      if (inputItem.span === 2) {
        currentColProps = {
          // gridColProps[col]
          lg: currentColProps.lg * 2,
          md: currentColProps.md * 2,
          sm: 24,
        };
      }
      inputGroupEles.push(
        <Col
          {...currentColProps}
          key={`filterItem_${filterIndex}`}
          style={{ marginTop: '8px', ...inputItem.colStyle }}
        >
          {inputComponent ? (
            <FormItem
              colon
              label={inputItem.name}
              style={{ width: '100%' }}
              {...currentFormItemLayout}
              {...help}
            >
              {inputItem.field ? (
                getFieldDecorator(inputItem.field, fieldDecorator)(inputComponent)
              ) : inputItem.type === 'onlyShow' ? (
                <span>{inputItem.value}</span>
              ) : (
                inputComponent
              )}
            </FormItem>
          ) : (
            <div style={{ height: 40 }} />
          )}
        </Col>
      );
    });
    return (
      <div className={styles.wrap}>
        <Form layout="inline" className={styles.filterForm}>
          <Row type={rowType} gutter={gridRowProps}>
            {inputGroupEles}
          </Row>
        </Form>
      </div>
    );
  }
}

InputGroups.FormModal = FormModal;
export default InputGroups;
