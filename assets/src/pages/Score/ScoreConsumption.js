/**
 * author: 朱港回
 * time: 2019/03/14
 * feature: 积分消费
 */

import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form } from 'antd';
import BasePageComponent from '../BasePageComponent';

const namespace = 'scoreConsumption';

@connect(state => ({
  [namespace]: state[namespace],
  loading: state.loading,
  currentUser: state.user.currentUser,
}))
@Form.create()
class ScoreConsumption extends BasePageComponent {
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
      title: formatMessage({ id: 'form.consumption.isScore.label' }), // 是否能用积分抵扣
      width: 110,
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: formatMessage({ id: 'form.consumption.ScorePercentage.label' }), // 抵扣百分比
      width: 120,
      dataIndex: 'ScorePercentage',
      key: 'ScorePercentage',
    },
    {
      title: formatMessage({ id: 'form.consumption.productPrice.label' }), // 商品价格
      width: 110,
      dataIndex: 'productPrice',
      key: 'productPrice',
    },
    {
      title: formatMessage({ id: 'form.consumption.payPrice.label' }), // 付款价格
      width: 120,
      dataIndex: 'payPrice',
      key: 'payPrice',
    },
  ];
}

export default ScoreConsumption;
