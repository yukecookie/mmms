/**
 * author: 朱港回
 * time: 2019/03/15
 * feature: 礼品管理
 */

import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form } from 'antd';
import BasePageComponent from '../BasePageComponent';

const namespace = 'giftManage';

@connect(state => ({
  [namespace]: state[namespace],
  loading: state.loading,
  currentUser: state.user.currentUser,
}))
@Form.create()
class GiftManage extends BasePageComponent {
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
      name: formatMessage({ id: 'form.consumption.orderCode.label' }), // 不要filter 按积分排序就行
      field: 'orderCode',
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
      title: formatMessage({ id: 'form.consumption.orderCode.label' }), // 商品编号
      width: 150,
      dataIndex: 'orderCode',
      key: 'orderCode',
    },
    {
      title: formatMessage({ id: 'form.cardNum.label' }), // 商品名称
      width: 110,
      dataIndex: 'cardNum',
      key: 'cardNum',
    },
    {
      title: formatMessage({ id: 'form.consumption.isScore.label' }), // 所需要积分
      width: 110,
      dataIndex: 'amount',
      key: 'amount',
    },
  ];
}

export default GiftManage;
