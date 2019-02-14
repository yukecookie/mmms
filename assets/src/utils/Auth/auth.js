import Lodash from 'lodash';
import { base64encode } from '../base64';
import cookieUtil from '../cookieUtil';
import { delay } from '../utils';
import { getStringHash } from '../stringHash';
import { fakeAccountLogin } from '../../services/api';
// import { detailReg } from '../nav';
/* eslint-disable no-else-return,no-use-before-define */
/**
 * 当前权限列表下，是否可以显示该菜单
 * @param privilegeList
 * @param menu
 * @returns {boolean}
 */
export function privilegesCanShowMenu(privilegeList, menu) {
  // !menu.doAuth ||
  if (!menu.hashCode || isAdminUser()) {
    return true;
  }
  return privilegeList.indexOf(menu.hashCode) >= 0;
}

/**
 * 通过权限list过滤菜单
 * @param menus
 * @param privilegeList
 */
export function filterMenusWithPrivileges(menus, privilegeList) {
  if (!menus) {
    return undefined;
  }
  const newMenus = menus.filter(item => privilegesCanShowMenu(privilegeList, item));
  return newMenus.map(item => ({
    ...item,
    children: filterMenusWithPrivileges(item.children, privilegeList),
  }));
}

/**
 * 设置用户当前权限
 * @param currentRolePrivileges 用户的所有的功能权限资源的pathCode列表
 */
export function setCurrentUserPrivileges(currentRolePrivileges) {
  // eslint-disable-next-line no-underscore-dangle
  window.currentRolePrivileges = currentRolePrivileges;
  // return window.mDvaApp._store.getState().user.userPrivileges || [];
}

/**
 * 获取用户当前的功能权限 用户的所有的功能权限资源的pathCode列表
 * @returns {Array}
 */
export function getCurrentUserPrivileges() {
  // eslint-disable-next-line no-underscore-dangle
  return window.currentRolePrivileges || [];
  // return window.mDvaApp._store.getState().user.userPrivileges || [];
}

const localStoreKey = 'ln_oms_index';
/**
 * 获取用户当前能访问的所有店铺
 * @returns {any}
 */
export const loadLocalStoreShopCodes = () => {
  const str = localStorage.getItem(localStoreKey);
  if (str && str !== '[]') {
    return JSON.parse(str);
  }
  return 0;
};

export const saveLocalStoreShopCodes = currentBaseStoreCodes => {
  localStorage.setItem(localStoreKey, JSON.stringify([...new Set(currentBaseStoreCodes)]));
};

/**
 * 获取用户首页设置的当前店铺
 * @returns {*|Array}
 */
export async function getCurrentUserSetStores() {
  // return window.currentUserSetStores || [];
  if (window.currentUserSetStores) {
    return window.currentUserSetStores;
  }
  await delay(500);
  if (window.currentUserSetStores) {
    return window.currentUserSetStores;
  }
  await delay(500);
  return window.currentUserSetStores || [];
  // return window.mDvaApp._store.getState().user.userPrivileges || [];
}

/**
 * 设置用户首页设置的当前店铺
 * @param currentRoleStores
 */
export function setCurrentUserSetStores(currentRoleStores) {
  window.currentUserSetStores = currentRoleStores;
  // return window.mDvaApp._store.getState().user.userPrivileges || [];
}

/**
 * 获取用户有权限访问的所有店铺
 * @returns {*|Array}
 */
export async function getCurrentUserPrivilegesStores() {
  // eslint-disable-next-line no-underscore-dangle
  if (window.currentRoleStores) {
    return window.currentRoleStores;
  }
  await delay(500);
  if (window.currentRoleStores) {
    return window.currentRoleStores;
  }
  await delay(500);
  return window.currentRoleStores || [];
  // return window.mDvaApp._store.getState().user.userPrivileges || [];
}

/**
 * 设置用户有权限访问的所有的店铺
 * @param currentRoleStores
 */
export function setCurrentUserPrivilegesStores(currentRoleStores) {
  // eslint-disable-next-line no-underscore-dangle
  window.currentRoleStores = currentRoleStores;
  const localStoredata = loadLocalStoreShopCodes();
  if (localStoredata && localStoredata.length) {
    if (Lodash.intersection(currentRoleStores, localStoredata).length >= localStoredata.length) {
      setCurrentUserSetStores(localStoredata);
      return;
    }
  }
  setCurrentUserSetStores(currentRoleStores);
  // return window.mDvaApp._store.getState().user.userPrivileges || [];
}

/**
 * 设置Authorization
 * @returns {string|*}
 */
export async function getCurrentUserId() {
  // eslint-disable-next-line no-underscore-dangle
  // const authorization = getAuthorization();
  // if (!authorization) {
  //   return;
  // }
  // const base64String = authorization.split(/\s+/)[1].trim();
  // const [username] = base64decode(base64String).split(':');
  // return username;
  const state = window.mDvaApp._store.getState(); // eslint-disable-line
  if (state.user && state.user.currentUser && state.user.currentUser.userId) {
    return state.user.currentUser.userId;
  }
  const httpRes = await fakeAccountLogin();
  if (httpRes.success) {
    return httpRes.data.uid;
  }
  return null;
}

/**
 * 保存Authorization
 * @param userName
 * @param password
 */
export function setAuthorization(userName, password) {
  // eslint-disable-next-line no-underscore-dangle
  // cookieUtil.setItem('userId', window.authorization);

  window.authorization = `Basic ${base64encode(`${userName}:${password}`)}`;
  cookieUtil.setItem('authorization', window.authorization);
}

/**
 * 设置Authorization
 * @returns {string|*}
 */
export function getAuthorization() {
  // eslint-disable-next-line no-underscore-dangle
  if (window.authorization) {
    return window.authorization;
  } else {
    window.authorization = cookieUtil.getItem('authorization');
    return window.authorization;
  }
}

/**
 * 清除Authorization
 */
export function clearAuthorization() {
  // eslint-disable-next-line no-underscore-dangle
  delete window.authorization;
  delete window.currentRolePrivileges;
  cookieUtil.removeItem('authorization');
}

/**
 * 获取当前用户角色
 */
export function getCurrentUserRole(userGroups) {
  window.currentUserRoles = userGroups;
  let currentUserRole = cookieUtil.getItem('userRole');
  if (currentUserRole && userGroups.indexOf(currentUserRole) >= 0) {
    return currentUserRole;
  } else {
    [currentUserRole] = userGroups;
    // cookieUtil.setItem();
    setCurrentUserRole('userRole', currentUserRole);
    return currentUserRole;
  }
}

/**
 * 获取当前用户的所有角色列表
 */
export function getCurrentUserRoles() {
  return window.currentUserRoles || [];
}

/**
 * 设置当前用户角色
 */
export function setCurrentUserRole(userRole) {
  cookieUtil.setItem('userRole', userRole);
}

/**
 * 关闭所有详情页面
 */
export function closeAllDetailPage() {
  if (window.tagsPageOpened) {
    window.tagsPageOpened.closeAllDetailPage();
  }
}

/**
 * 判断当前用户是否是超级管理员身份
 */
export function isAdminUser() {
  // return true;
  return getCurrentUserRoles().indexOf('admingroup') >= 0;
}

export const detailReg = /-detail\/(\w+)/;

/**
 * 是否当前页面的某个按钮的权限
 *
 * @export
 * @param {*} code 按钮的code
 * @returns
 */
export function isHasAuth(code) {
  // if (isAdminUser()) {
  //   return true;
  // }
  // eslint-disable-next-line no-underscore-dangle
  const { pathname: pathnameArg } = window.mDvaApp._history.location;
  const result = detailReg.exec(pathnameArg);
  // let appendStr = '';
  let pathname = pathnameArg;

  if (result && result[1]) {
    pathname = pathnameArg.replace(detailReg, '-detail');
    // appendStr = `[${result[1]}]`;
  }

  const privilegeList = getCurrentUserPrivileges();
  const changePathName = `${pathname.substr(1).replace(/\/+/g, '.')}.${code}`;
  if (privilegeList.indexOf(getStringHash(changePathName)) < 0) {
    return false;
  } else {
    return true;
  }
}

/**
 * 是否拥有某个枚举权限
 *
 * @export
 * @param {*} code
 * @returns
 */
export function hasEnumAuth(typeName, code) {
  // eslint-disable-next-line no-underscore-dangle
  const privilegeList = getCurrentUserPrivileges();
  const changePathName = `index.${typeName}.${code}`;
  if (privilegeList.indexOf(getStringHash(changePathName)) < 0) {
    return false;
  } else {
    return true;
  }
}
