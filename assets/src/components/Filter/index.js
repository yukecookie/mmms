/* eslint-disable react/no-array-index-key, react/jsx-indent */
/**
 * Created by yunqiang.wu on 7/9/2017.
 *
 * 通用查询过滤
 */
import React, { PureComponent } from 'react';
import {
  Form,
  Button,
  Checkbox,
  Select,
  Input,
  Row,
  Col,
  DatePicker,
  Radio,
  Cascader,
  InputNumber,
} from 'antd';
import { formatMessage } from 'umi/locale';
import TagSelect from '../TagSelect';
import NumberRangeInput from '../NumberRangeInput';
import MultiConditionInput from '../MultiConditionInput';
import SelectedInput from '../SelectedInput';
import RadioButtonTimeRange from '../RadioButtonTimeRange';
import BooleanSelect from '../Input/BooleanSelect';
import { getContentScrollContainer } from '../../utils/utils';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;

const defaultFormItemLayout = {
  4: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  3: {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  },
  2: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  },
  1: {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  },
};

const gridColProps = {
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
// const buttonItemLayout = {
//   wrapperCol: { span: 18, offset: 5 },
// };

class Filter extends PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {}

  handleSearch = () => {
    const { onFilterChange, filters, form } = this.props;
    if (onFilterChange) {
      const fieldNames = filters.map(item => item.field);
      // Filter 验证数据
      form.validateFields(fieldNames, {}, (err, values) => {
        if (!err) {
          // 如果验证成功,则执行 onOk
          onFilterChange(values);
        }
      });
    }
  };

  handleReset = () => {
    const {
      onResetFrom,
      onBeforeResetFrom,
      form,
      form: { getFieldsValue, setFieldsValue, resetFields },
      filters,
    } = this.props;
    if (onBeforeResetFrom) {
      onBeforeResetFrom();
    }
    if (typeof onResetFrom === 'string') {
      resetFields(onResetFrom.split(','));
    } else if (onResetFrom) {
      onResetFrom(form);
    } else {
      const fields = getFieldsValue();
      fields.map(item => {
        if ({}.hasOwnProperty.call(fields, item) && item !== '__cacheWrapper') {
          const filterItem = filters.find(item2 => item2.field === item);
          if (filterItem && filterItem.resetToDefaultValue) {
            fields[item] = filterItem.value;
          } else if (fields[item] instanceof Array) {
            fields[item] = [];
          } else {
            fields[item] = undefined;
          }
        }
        return item;
      });
      // for (const item in fields) {
      //   if ({}.hasOwnProperty.call(fields, item) && item !== '__cacheWrapper') {
      //     const filterItem = filters.find(item2 => item2.field === item);
      //     if (filterItem && filterItem.resetToDefaultValue) {
      //       fields[item] = filterItem.value;
      //     } else if (fields[item] instanceof Array) {
      //       fields[item] = [];
      //     } else {
      //       fields[item] = undefined;
      //     }
      //   }
      // }
      setFieldsValue(fields);
    }
  };

  render() {
    const {
      // onFilterChange,
      rowType,
      col = 4,
      gutter = 0,
      formItemLayout,
      filters,
      appendFilters = [],
      loading,
      hideSubmit,
      form,
      form: {
        getFieldDecorator,
        // getFieldValue,
      },
      extraButtons = [],
      rightButtonArea,
    } = this.props;

    const inputItems = [];
    filters.forEach((filter, filterIndex) => {
      if (!filter) {
        return;
      }
      if (filter.hide) {
        if (typeof filter.hide === 'function') {
          if (filter.hide(form)) {
            return;
          }
        }
        if (filter.hide === true) {
          return;
        }
      }
      let inputComponent;
      switch (filter.type) {
        case 'select':
          inputComponent = (
            <Select
              data-code={filter.field}
              filterOption={(inputValue, option) =>
                option.props.children.includes(inputValue) ||
                option.props.value.includes(inputValue)
              }
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              allowClear
              placeholder={formatMessage({ id: 'app.filter.select_pleaseChoose' })}
              notFoundContent={formatMessage({ id: 'app.filter.message_noData' })}
              key={`select_${filterIndex}`}
              getPopupContainer={getContentScrollContainer}
              {...filter.inputProps}
            >
              {filter.renderDataSourceOption
                ? filter.renderDataSourceOption(filter.dataSource)
                : filter.dataSource &&
                  filter.dataSource.map(item => {
                    const code = `${item[filter.dataSourceValueField || 'code']}`;
                    const name = item[filter.dataSourceNameField || 'name'] || code;
                    return (
                      <Option key={`opt_${code}`} value={code}>
                        {name}
                      </Option>
                    );
                  })}
            </Select>
          );
          break;
        case 'tag-select':
          inputComponent = (
            <TagSelect
              data-code={filter.field}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              key={`select_${filterIndex}`}
              {...filter.inputProps}
            >
              {filter.renderDataSourceOption
                ? filter.renderDataSourceOption(filter.dataSource)
                : filter.options.map(item => {
                    const code = `${item[filter.dataSourceValueField || 'code']}`;
                    const name = item[filter.dataSourceNameField || 'name'] || code;
                    return (
                      <TagSelect.Option value={code} key={name}>
                        {name}
                      </TagSelect.Option>
                    );
                  })}
            </TagSelect>
          );
          break;
        case 'bool-select':
          inputComponent = (
            <BooleanSelect
              data-code={filter.field}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              allowClear
              placeholder={formatMessage({ id: 'app.filter.select_pleaseChoose' })}
              key={`bool-select_${filterIndex}`}
              getPopupContainer={getContentScrollContainer}
              {...filter.inputProps}
            />
          );
          break;
        case 'checkbox':
          inputComponent = (
            <Checkbox
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value.target.checked, form);
                }
              }}
              data-code={filter.field}
              {...filter.inputProps}
            />
          );
          break;
        case 'checkbox-group':
          inputComponent = (
            <CheckboxGroup
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value.target.checked, form);
                }
              }}
              data-code={filter.field}
              options={filter.options}
            />
          );
          break;
        case 'date':
          inputComponent = (
            <DatePicker
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              style={{ width: '100%' }}
              data-code={filter.field}
              getCalendarContainer={getContentScrollContainer}
              {...filter.inputProps}
            />
          );
          break;
        case 'number-range':
          inputComponent = (
            <NumberRangeInput
              data-code={filter.field}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              key={`input_${filterIndex}`}
              {...filter.inputProps}
            />
          );
          break;
        case 'radio-range-picker':
          inputComponent = (
            <RadioButtonTimeRange
              data-code={filter.field}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              key={`input_${filterIndex}`}
              getCalendarContainer={getContentScrollContainer}
              {...filter.inputProps}
            />
          );
          break;
        case 'multi-condition':
          inputComponent = (
            <MultiConditionInput
              data-code={filter.field}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              key={`input_${filterIndex}`}
              style={{ height: '78px', minHeight: '78px', float: 'left' }}
              {...filter.inputProps}
            />
          );
          break;
        case 'select-input':
          inputComponent = (
            <SelectedInput
              data-code={filter.field}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              key={`input_${filterIndex}`}
              // style={{ height: '78px', minHeight: '78px', float: 'left' }}
              {...filter.inputProps}
            />
          );
          break;
        case 'textArea':
          inputComponent = (
            <Input.TextArea
              data-code={filter.field}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              placeholder={formatMessage({ id: 'app.filter.text_pleaseInput' })}
              key={`input_${filterIndex}`}
              {...filter.inputProps}
            />
          );
          break;
        case 'range-picker':
          inputComponent = (
            <RangePicker
              data-code={filter.field}
              placeholder={[
                formatMessage({ id: 'app.filter.text_startDate' }),
                formatMessage({ id: 'app.filter.text_endDate' }),
              ]}
              {...filter.inputProps}
              getCalendarContainer={getContentScrollContainer}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
            />
          );
          break;
        case 'cascader':
          inputComponent = (
            <Cascader
              data-code={filter.field}
              // defaultValue={['省', '市','区']}
              placeholder={formatMessage({ id: 'app.filter.select_pleaseChoose' })}
              options={filter.options}
              {...filter.inputProps}
              getPopupContainer={getContentScrollContainer}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
            />
          );
          break;
        case 'input-search':
          inputComponent = (
            <Input.Search
              data-code={filter.field}
              options={filter.options}
              {...filter.inputProps}
              // onChange={(value) => {
              //   if (filter.onChange) {
              //     filter.onChange(value.target.value, form);
              //   }
              // }}
            />
          );
          break;
        case 'radio':
          inputComponent = (
            <RadioGroup
              data-code={filter.field}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              allowClear
              key={`select_${filterIndex}`}
              style={{ marginLeft: 4, minHeight: 32 }}
              {...filter.inputProps}
            >
              {filter.renderDataSourceOption
                ? filter.renderDataSourceOption(filter.dataSource)
                : filter.dataSource.map(item => (
                    <Radio
                      key={`opt_${item[filter.dataSourceValueField || 'code']}`}
                      value={`${item[filter.dataSourceValueField || 'code']}`}
                    >
                      {item[filter.dataSourceNameField || 'name']}
                    </Radio>
                  ))}
            </RadioGroup>
          );
          break;
        case 'radio-button':
          inputComponent = (
            <RadioGroup
              data-code={filter.field}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              allowClear
              key={`select_${filterIndex}`}
              style={{ marginLeft: 4 }}
              {...filter.inputProps}
            >
              {filter.renderDataSourceOption
                ? filter.renderDataSourceOption(filter.dataSource)
                : filter.dataSource.map(item => (
                    <RadioButton
                      key={`opt_${item[filter.dataSourceValueField || 'code']}`}
                      value={`${item[filter.dataSourceValueField || 'code']}`}
                      disabled={item.disabled}
                    >
                      {item[filter.dataSourceNameField || 'name']}
                    </RadioButton>
                  ))}
            </RadioGroup>
          );
          break;
        case 'input-number':
          /**
           * antd InputNumber输入框
           */
          inputComponent = (
            <InputNumber
              data-cold={filter.field}
              onChange={value => {
                if (filter.onChange) {
                  filter.onChange(value, form);
                }
              }}
              placeholder={`${filter.placeholder ||
                formatMessage({ id: 'app.filter.text_pleaseInput' })}`}
              key={`input-number_${filterIndex}`}
              style={{ width: '100%' }}
              // formatter={ filter.formatter === '%' ? value => `${value}%` : value }
              // parser={ filter.formatter === '%' ? value => value.replace('%', '') : value }
              {...filter.inputProps}
            />
          );
          break;
        default:
          if (typeof filter.type === 'function') {
            inputComponent = (
              <filter.type
                data-code={filter.field}
                onChange={value => {
                  if (filter.onChange) {
                    filter.onChange(value, form);
                  }
                }}
                placeholder={formatMessage({ id: 'app.filter.text_pleaseInput' })}
                key={`input_${filterIndex}`}
                {...filter.inputProps}
              />
            );
          } else {
            inputComponent = filter.name ? (
              <Input
                data-code={filter.field}
                onChange={value => {
                  if (filter.onChange) {
                    filter.onChange(value, form);
                  }
                }}
                placeholder={formatMessage({ id: 'app.filter.text_pleaseInput' })}
                key={`input_${filterIndex}`}
                {...filter.inputProps}
              />
            ) : (
              false
            );
          }
          break;
      }
      let currentFormItemLayout =
        filter.formItemLayout || formItemLayout || defaultFormItemLayout[filter.col || col]; // 获取每一列的布局
      // 假如传进来key, 则将key绑定到 FormItem上
      const filterKeyProp = filter.key ? { key: filter.key } : {};
      let currentColProps = gridColProps[filter.col || col];
      let rulesColProps = filter.rules;
      if (typeof rulesColProps === 'function') {
        rulesColProps = filter.rules(form);
      }
      if (filter.span) {
        currentColProps = {
          // gridColProps[col]
          lg: currentColProps.lg * filter.span,
          md: currentColProps.md * filter.span,
          sm: 24,
        };
        try {
          const newLabelColSpan = currentFormItemLayout.labelCol.span / filter.span;
          currentFormItemLayout = {
            labelCol: { span: newLabelColSpan },
            wrapperCol: { span: 24 - newLabelColSpan },
          };
        } catch (e) {
          // console.error(e);
        }
      }
      inputItems.push(
        <Col
          {...currentColProps}
          key={`filterItem_${filterIndex}`}
          style={{ marginTop: '8px', ...filter.colStyle }}
        >
          {inputComponent ? (
            <FormItem
              colon
              label={filter.name}
              style={{
                width: filter.suffix ? '270px' : '100%',
                display: filter.isHide ? 'none' : 'inline-block',
              }}
              key={filter.key}
              {...filterKeyProp}
              {...currentFormItemLayout}
            >
              {filter.field
                ? getFieldDecorator(filter.field, {
                    initialValue: filter.value,
                    valuePropName: filter.valuePropName || 'value',
                    rules: rulesColProps || filter.rules,
                  })(inputComponent)
                : inputComponent}
            </FormItem>
          ) : (
            <div style={{ height: '32px', marginTop: '8px' }} />
          )}
          {filter.suffix ? (
            <span style={{ width: '40px', lineHeight: '32px', height: '32px' }}>
              {filter.suffix}
            </span>
          ) : (
            ''
          )}
        </Col>
      );
    });
    const appendItems = appendFilters.map((r, index) => {
      const currentColProps = gridColProps[r.col || col];
      return (
        <Col
          {...currentColProps}
          key={`appendItem_${index}`}
          style={{ marginTop: '8px', ...r.colStyle }}
        >
          <div
            style={{
              width: r.suffix ? '270px' : '100%',
              display: r.isHide ? 'none' : 'inline-block',
            }}
          >
            {r.$component}
          </div>
        </Col>
      );
    });
    return (
      <div className={styles.wrap}>
        <Form layout="inline" className={styles.filterForm}>
          {/* md: 4, lg: 8, xl: 24,for colspan's appearance */}
          <Row type={rowType} gutter={gutter}>
            {inputItems}
            {/* 把所有的FormItem加进这行 */}
            {appendItems}
            {/* 把所有的appendItem放在inputItems之后 */}
          </Row>
          {hideSubmit ? (
            false
          ) : (
            <Row gutter={8} className={styles.btnPanel}>
              <Col lg={rightButtonArea ? 10 : 24} md={rightButtonArea ? 10 : 24} sm={24}>
                <Row gutter={0}>
                  <Col span={24}>
                    <Button
                      data-code="search"
                      loading={loading}
                      htmlType="submit"
                      type="primary"
                      onClick={this.handleSearch}
                      icon="search"
                    >
                      {formatMessage({ id: 'app.filter.btn_search' })}
                    </Button>
                    <Button data-code="reset" onClick={this.handleReset} icon="retweet">
                      {formatMessage({ id: 'app.filter.btn_reset' })}
                    </Button>
                    {extraButtons}
                  </Col>
                </Row>
              </Col>
              {rightButtonArea && (
                <Col lg={14} md={14} sm={24}>
                  {rightButtonArea}
                </Col>
              )}
            </Row>
          )}
        </Form>
      </div>
    );
  }
}

export default Filter;
