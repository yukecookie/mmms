/**
 * author: 朱港回
 * time: 2019/03/15
 * feature: 礼品管理
 */

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Link } from 'dva/router';
import { Form, Divider, Button } from 'antd';
import BasePageComponent from '../BasePageComponent';
import styles from './Give/ScoreGiven.less';

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
      styles,
    });
  }

  handleAdd = () => {};

  getExtraButtons = () => [
    <Button
      type="primary"
      ghost
      icon="plus"
      key="add"
      className={styles.addUserBtn}
      onClick={this.handleAdd}
    >
      {formatMessage({ id: 'form.new.btn' })}
    </Button>,
  ];

  getFilters = () => [
    {
      name: formatMessage({ id: 'form.consumption.productType.label' }), // 商品类别
      field: 'productType',
    },
    {
      name: formatMessage({ id: 'form.consumption.productNum.label' }), // 商品编号
      field: 'productNum',
    },
    {
      name: formatMessage({ id: 'form.consumption.productName.label' }), // 商品名称
      field: 'productName',
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
      title: formatMessage({ id: 'form.consumption.productName.label' }), // 商品名称
      width: 110,
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: formatMessage({ id: 'form.consumption.needScore.label' }), // 所需积分
      width: 110,
      dataIndex: 'needScore',
      key: 'needScore',
    },
    {
      title: formatMessage({ id: 'form.userInfo.operation.label' }), // 操作
      width: 150,
      // dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => (
        <Fragment>
          <Link to={`/info/update-user?userName=${record.cardNum}`}>修改</Link>
          <Divider type="vertical" />
          <Link to={`/info/del-user?userName=${record.cardNum}`}>删除</Link>
        </Fragment>
      ),
    },
  ];
}

export default GiftManage;
