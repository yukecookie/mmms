/**
 * author: 朱港回
 * time: 2019/03/14
 * feature: 消费积分赠送
 */

import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form } from 'antd';
import BasePageComponent from '../../BasePageComponent';

const namespace = 'givenByConsumption';

@connect(state => ({
  [namespace]: state[namespace],
  loading: state.loading,
  currentUser: state.user.currentUser,
}))
@Form.create()
class Consumption extends BasePageComponent {
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
      title: formatMessage({ id: 'form.consumption.amount.label' }), // 消费金额
      width: 110,
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: formatMessage({ id: 'form.consumption.givenScore.label' }), // 商品类型
      width: 120,
      dataIndex: 'givenScore',
      key: 'givenScore',
    },
  ];
}

export default Consumption;
