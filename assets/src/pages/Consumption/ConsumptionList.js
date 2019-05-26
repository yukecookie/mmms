/**
 * author: 朱港回
 * time: 2019/03/17
 * feature: 消费
 */

import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { Form, Button, message, Modal } from 'antd';
import BasePageComponent from '../BasePageComponent';
import styles from './ConsumptionList.less';
import showCreateModal from '@/utils/CreateModal';

const namespace = 'consumptionInfo';

@connect(state => ({
  [namespace]: state[namespace],
  loading: state.loading,
  currentUser: state.user.currentUser,
}))
@Form.create()
class ConsumptionList extends BasePageComponent {
  constructor(props) {
    const rowKey = 'orderCode';
    super(props, {
      namespace,
      rowKey,
      styles,
    });
  }

  // 刷新
  loadInitData = () => {
    this.props.dispatch({
      type: `${namespace}/fetchList`,
    });
  };

  handleAdd = () => {
    showCreateModal({
      title: formatMessage({ id: 'form.consumption.addModal.title' }),
      width: 800,
      col: 2,
      inputItems: [
        {
          name: formatMessage({ id: 'form.consumption.orderCode.label' }),
          field: 'orderCode',
          placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
          rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
        },
        {
          name: formatMessage({ id: 'form.cardNum.label' }),
          field: 'cardNum',
          placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
          rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
        },
        {
          name: formatMessage({ id: 'form.consumption.productType.label' }),
          field: 'productType',
          placeholder: formatMessage({ id: 'app.filter.select_pleaseChoose' }),
          rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
        },
        {
          name: formatMessage({ id: 'form.consumption.amount.label' }),
          field: 'amount',
          placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
          rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
        },
        {
          name: formatMessage({ id: 'form.consumption.isOnSale.label' }), // 是否打折
          type: 'radio',
          field: 'isOnSale',
          value: 'false',
          rules: [
            { required: true, message: formatMessage({ id: 'app.filter.select_pleaseChoose' }) },
          ],
          dataSource: [
            {
              text: '是',
              value: 'true',
            },
            {
              text: '否',
              value: 'false',
            },
          ],
        },
        {
          name: formatMessage({ id: 'form.consumption.discount.label' }),
          type: 'input-number',
          field: 'discount',
          value: 100,
          formatter: '%',
          inputProps: {
            min: 0,
            max: 100,
            // style: { width: '100%' },
          },
          placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
          hide: form => form.getFieldValue('isOnSale') !== 'true',
          // inputProps: {
          //   disabled: form => form.getFieldValue('isOnSale') !== 'true',
          // },
        },
        {
          name: formatMessage({ id: 'form.consumption.isScore.label' }), // 是否能用积分抵扣
          type: 'radio',
          field: 'isScore',
          value: 'false',
          rules: [
            { required: true, message: formatMessage({ id: 'app.filter.select_pleaseChoose' }) },
          ],
          formItemLayout: {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
          },
          dataSource: [
            {
              text: '是',
              value: 'true',
            },
            {
              text: '否',
              value: 'false',
            },
          ],
        },
        {
          name: formatMessage({ id: 'form.consumption.orderCreationDate.label' }),
          type: 'date',
          field: 'orderCreationDate',
          inputProps: {
            showTime: true,
            format: 'YYYY-MM-DD HH:mm:ss',
            placeholder: formatMessage({ id: 'app.filter.select_pleaseChoose' }),
          },
          // formItemLayout: {
          //   labelCol: { span: 10 },
          //   wrapperCol: { span: 14 },
          // },
          rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
        },
      ],
      onHandleOk: values => {
        const { dispatch } = this.props;
        dispatch({
          // 先判断订单编号是否存在 再判断会员卡号是否存在 再添加
          type: `${namespace}/fetchOrderCodeVerify`,
          payload: { orderCode: values.orderCode },
        }).then(res => {
          if (res.isExistence) {
            Modal.error({
              title: '添加失败',
              content: '订单编号不能重复',
            });
          } else {
            dispatch({
              type: `${namespace}/fetchCardNumVerify`,
              payload: { cardNum: values.cardNum },
            }).then(re => {
              if (!re.isExistence) {
                Modal.error({
                  title: '添加失败',
                  content: '会员卡号不存在',
                });
              } else {
                dispatch({
                  type: `${namespace}/fetchAddConsumptionInfo`,
                  payload: values,
                }).then(r => {
                  if (r.success) {
                    message.success(r.message || '添加成功');
                    this.loadInitData(); // 刷新列表
                  } else {
                    Modal.error({
                      title: '添加失败',
                      content: r.message,
                    });
                  }
                });
              }
            });
          }
        });
      },
    });
  };

  getExtraButtons = () => [
    <Button
      type="primary"
      ghost
      icon="plus"
      key="add"
      className={styles.addConsumptionBtn}
      onClick={this.handleAdd}
    >
      {formatMessage({ id: 'form.new.btn' })}
    </Button>,
  ];

  getFilters = () => [
    {
      name: formatMessage({ id: 'form.consumption.orderCode.label' }), // 订单编号
      field: 'orderCode',
    },
    {
      name: formatMessage({ id: 'form.cardNum.label' }), // 会员卡号
      field: 'cardNum',
    },
    {
      name: formatMessage({ id: 'form.consumption.amount.label' }), // 消费金额
      field: 'amount',
    },
    {
      name: formatMessage({ id: 'form.consumption.productType.label' }), // 商品类型
      field: 'productType',
    },
    {
      name: formatMessage({ id: 'form.consumption.orderCreationDate.label' }), // 下单时间
      field: 'orderCreationDateMin__orderCreationDateMax',
      type: 'range-picker',
      // col: 2,
      span: 2,
      inputProps: {
        showTime: {
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        },
      },
    },
  ];

  getColumns = () => [
    {
      title: formatMessage({ id: 'form.index.label' }), // index序号
      width: 60,
      key: 'index',
      // dataIndex: 'index',
      render: (val, record, index) => index + 1,
    },
    {
      title: formatMessage({ id: 'form.consumption.orderCode.label' }), // 订单编号
      width: 150,
      dataIndex: 'orderCode',
      key: 'orderCode',
    },
    {
      title: formatMessage({ id: 'form.cardNum.label' }), // 会员卡号
      width: 110,
      dataIndex: 'cardNum',
      key: 'cardNum',
    },
    {
      title: formatMessage({ id: 'form.consumption.amount.label' }), // 消费金额
      width: 110,
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: formatMessage({ id: 'form.consumption.productType.label' }), // 商品类型
      width: 120,
      dataIndex: 'productType',
      key: 'productType',
      // render: (item, record) => record.posInfo && record.posInfo.displayName,
    },
    {
      title: formatMessage({ id: 'form.consumption.orderCreationDate.label' }), // 下单时间
      width: 150,
      dataIndex: 'orderCreationDate',
      sorter: true,
      key: 'orderCreationDate',
    },
  ];
}

export default ConsumptionList;
