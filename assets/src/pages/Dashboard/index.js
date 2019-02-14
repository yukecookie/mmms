import React, { Component } from 'react';
import styles from './index.less';

class UserInfo extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.box}>
        <img src={require('../../assets/Dashboard.jpg')} alt="#" /> {/*eslint-disable-line */}
      </div>
    );
  }
}

export default UserInfo;
