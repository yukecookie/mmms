/**
 * author: 朱港回
 * time: 2019/01/22
 * feature: 消费信息查询
 */

import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Button, message, Modal } from 'antd';
import BasePageComponent from '../BasePageComponent';
import styles from './ConsumptionList.less';
import { showCreateModal } from '@/utils/CreateModal';

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

  handleAdd = () => {
    showCreateModal({
      title: '添加消费信息',
      width: 800,
      col: 1,
      inputItems: [
        {
          name: '结束时间',
          type: 'date',
          field: 'endDate',
          inputProps: {
            showTime: true,
            format: 'YYYY-MM-DD HH:mm:ss',
            placeholder: '结束时间',
          },
          rules: [{ required: true, message: '时间不能为空' }],
        },
      ],
      onHandleOk: values => {
        // console.log(data);
        const { dispatch } = this.props;
        dispatch({
          type: `${this.options.namespace}/continue`,
          payload: {
            endDate: values.endDate,
            isReservation: false,
          },
        }).then(
          res => {
            message.success(res.message || '续占成功');
            // this.loadInitData();// 刷新列表
            return res;
          },
          err => {
            Modal.error({
              title: '续占失败',
              content: err.message,
            });
            return Promise.reject(err);
          }
        );
      },
    });
  };

  getExtraButtons = () => [
    <Button
      type="primary"
      ghost
      icon="plus"
      className={styles.addConsumptionBtn}
      onClick={this.handleAdd}
    >
      {' '}
      {<FormattedMessage id="menu.personal" defaultMessage="添加消费信息" />}{' '}
    </Button>,
  ];

  getFilters = () => [
    {
      name: formatMessage({ id: 'form.consumption.orderCode.label' }), // 订单编号
      field: 'orderCode',
    },
    {
      name: formatMessage({ id: 'form.consumption.cardNum.label' }), // 会员卡号
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
      render: (val, record, index) => index + 1,
    },
    {
      title: formatMessage({ id: 'form.consumption.orderCode.label' }), // 订单编号
      width: 150,
      dataIndex: 'orderCode',
      key: 'orderCode',
    },
    {
      title: formatMessage({ id: 'form.consumption.cardNum.label' }), // 会员卡号
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
