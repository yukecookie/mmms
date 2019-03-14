/**
 * author: 朱港回
 * time: 2019/03/14
 * feature: 生日积分赠送
 */

import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form } from 'antd';
import BasePageComponent from '../../BasePageComponent';

const namespace = 'givenByBirth';

@connect(state => ({
  [namespace]: state[namespace],
  loading: state.loading,
  currentUser: state.user.currentUser,
}))
@Form.create()
class Birth extends BasePageComponent {
  constructor(props) {
    const rowKey = 'cardNum';
    super(props, {
      namespace,
      rowKey,
      // styles,
    });
  }

  getFilters = () => [
    {
      name: formatMessage({ id: 'form.consumption.cardNum.label' }), // 会员卡号
      field: 'cardNum',
    },
    {
      name: formatMessage({ id: 'form.consumption.name.label' }), // 姓名
      field: 'name',
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
      title: formatMessage({ id: 'form.consumption.cardNum.label' }), // 会员卡号
      width: 110,
      dataIndex: 'cardNum',
      key: 'cardNum',
    },
    {
      title: formatMessage({ id: 'form.consumption.name.label' }), // 姓名
      width: 110,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'form.consumption.birth.label' }), // 生日
      width: 120,
      dataIndex: 'birth',
      key: 'birth',
    },
    {
      title: formatMessage({ id: 'form.consumption.givenScore.label' }), // 积分
      width: 120,
      dataIndex: 'givenScore',
      key: 'givenScore',
    },
  ];
}

export default Birth;
