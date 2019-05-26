/**
 * author: 朱港回
 * time: 2019/03/14
 * feature: 生日积分赠送
 */

import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form } from 'antd';
import BasePageComponent from '../../BasePageComponent';
import styles from './ScoreGiven.less';

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
      styles,
    });
  }

  getExtraButtons = () => [];

  getFilters = () => [
    {
      name: formatMessage({ id: 'form.cardNum.label' }), // 会员卡号
      field: 'cardNum',
    },
    {
      name: formatMessage({ id: 'form.consumption.userName.label' }), // 姓名
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
      title: formatMessage({ id: 'form.cardNum.label' }), // 会员卡号
      width: 110,
      dataIndex: 'cardNum',
      key: 'cardNum',
    },
    {
      title: formatMessage({ id: 'form.consumption.userName.label' }), // 用户名
      width: 110,
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: formatMessage({ id: 'form.consumption.givenScore.label' }), // 积分
      width: 120,
      dataIndex: 'givenScore',
      key: 'givenScore',
    },
    {
      title: formatMessage({ id: 'form.consumption.givenTime.label' }), // 赠送时间
      width: 120,
      dataIndex: 'givenTime',
      key: 'givenTime',
    },
  ];
}

export default Birth;
