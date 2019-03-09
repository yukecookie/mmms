import React from 'react';
// import { Link } from 'dva/router';
// import PageHeader from '../components/PageHeader';
import styles from './PageHeaderLayout.less';
import globalStyles from '../common/globalStyles.less';

export default ({ children, filter, operator, table, wrapperClassName, top }) => (
  <div className={wrapperClassName}>
    {top}
    {/* <PageHeader key="pageheader" {...restProps} linkElement={Link} /> */}
    <div className={styles.content}>
      {operator ? <div className={globalStyles.operator}>{operator}</div> : null}
      {filter ? <div className={globalStyles.filter}>{filter}</div> : null}
      {table ? <div className={globalStyles.table}>{table}</div> : null}
      {children}
    </div>
  </div>
);
