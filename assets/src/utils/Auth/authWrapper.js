/* eslint-disable max-len,no-else-return */
/* eslint-disable  */

import React, { Component } from 'react';
import Lodash from 'lodash';
import classnames from 'classnames';
import { Modal } from 'antd';
import { getCurrentUserPrivileges, isAdminUser } from './auth';
import { getStringHash } from '../stringHash';

/**
 * 权限控制 高阶组件
 *
 * @example
 * - @auth(PRIVILEGES.库存管理_创建)  // 参数为 modal 的namespace
 * - @auth(PRIVILEGES.库存管理_删除,PRIVILEGES.库存管理_删除)  // 参数为 modal 的namespace
 * - const AuthButton = auth({  privilege: PRIVILEGES.库存管理_删除, type: 'disable'  })(Button)
 *
 * @param {[string] | string} privilege
 *          组件对应的权限，必传
 * @param {'disable' | 'preventActionShowTip' | 'replaceTip'} [type]
 *          无权限时，处理的方法类型：
 *            - preventActionShowTip: 点击组件时阻止动作并提示文案，
 *            - disable: 设置组件props属性 disable 为 true,
 *            - replaceTip(默认): 组件替换成对应的提示，或者 noAuthTip 参数给出的组件
 * @param {string|reactElement} [noAuthTip]
 *          组件无权限时，对应展示的文案 ( 默认为 '没有权限')，
 *
 *
 */
export const auth = (...args) => {
  const defaultNoAuthTip = <span>当前用户角色没有权限</span>;
  const defaultAuthType = 'replaceTip';

  const handleArgs = arg => {
    if (Object.prototype.toString.call(arg) === '[object Array]' && arg.length > 0) {
      if (typeof arg[0] === 'number') {
        return {
          privilege: arg,
          noAuthTip: defaultNoAuthTip,
          type: defaultAuthType,
        };
      } else if (typeof arg[0] === 'object') {
        return {
          privilege: handleArgs(arg[0].privilege).privilege || [],
          noAuthTip: arg[0].noAuthTip || defaultNoAuthTip,
          type: arg[0].type || defaultAuthType,
          userPrivilegeList: arg[0].userPrivilegeList,
        };
      } else {
        return {
          privilege: [],
          noAuthTip: defaultNoAuthTip,
          type: defaultAuthType,
        };
      }
    } else if (typeof arg === 'string') {
      return {
        privilege: [arg],
        noAuthTip: defaultNoAuthTip,
        type: defaultAuthType,
      };
    } else {
      return {
        privilege: [],
        noAuthTip: defaultNoAuthTip,
        type: defaultAuthType,
      };
    }
  };

  // eslint-disable-next-line no-unused-vars
  const { privilege, noAuthTip, type } = handleArgs(args);

  return ComposedComponent => {
    return class WrapComponent extends Component {
      constructor(props) {
        super(props);
        const privilegeList = getCurrentUserPrivileges();
        this.state = {
          isAuthed: Lodash.intersection(privilegeList, privilege).length > 0,
        };
      }

      render() {
        if (this.state.isAuthed) {
          return <ComposedComponent {...this.props} />;
        } else if (type === 'preventActionShowTip') {
          return (
            <ComposedComponent
              {...this.props}
              onClick={() => {
                if (this.props.onClick) {
                  Modal.warn({
                    content: noAuthTip,
                  });
                }
              }}
              className={classnames(this.props.className, 'noAuth')}
            />
          );
        } else if (type === 'disable') {
          return (
            <ComposedComponent
              {...this.props}
              disabled
              className={classnames(this.props.className, 'noAuth')}
            />
          );
        } else if (type === 'none') {
          return false;
        } else {
          return noAuthTip;
        }
      }
    };
  };
};

/**
 * 权限包装函数
 * @param authData 页面props中的 权限数据
 * @param component 需要被包装的权限控件
 * @param 控对应的code 该code 需要和 menu.config2.js 中定义的code对应
 * @returns {*}
 */
export function authWrap(pageThis, component, componentCode) {
  const { pageConfig } = pageThis.props;
  if (pageConfig && componentCode && !isAdminUser()) {
    return auth({
      privilege: getStringHash(`${pageConfig.codePath}.${componentCode}`),
      type: 'none',
    })(component);
  }
  return component;
}
