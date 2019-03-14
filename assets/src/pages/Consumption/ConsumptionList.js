/**
 * author: 朱港回
 * time: 2019/01/22
 * feature: 消费信息查询
 */

import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { Form } from 'antd';
import BasePageComponent from '../BasePageComponent';

const namespace = 'consumptionInfo';

// @connect(({ loading }) => ({
//   submitting: loading.effects['form/submitRegularForm'],
// }))
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
      // styles,
    });
  }

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
