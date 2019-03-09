import moment from 'moment';
import React from 'react';
import lodash from 'lodash';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

/* eslint-disable no-else-return */

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

/**
 * @description 获取页面 滚动的 容器
 * // todo 当 select 多选模式 点击删除时(初始,而不是选择之后的删除), window.contentScrollContainer 为空
 */
export function getContentScrollContainer() {
  return window.contentScrollContainer || document.body;
}

// 用于 getAddressCascaderValueFromLowestAddressCode
const addressCodeReg = /([A-Z]{2})(-\d+)?(-\d+)?(-\d+)?/;
// 用于 getAddressCascaderValueFromLowestAddressCode
const addressCodeReg2 = /C?(\d\d)(\d\d)(\d\d)/;

/**
 * @description 通过最低级的 code 获取 [region,city,district]
 * @param lowestAddressCode  XX-dd1-XXdd1-dd2-XX-dd1-dd2-dd3
 * @returns [dd1,dd2,dd3]
 */
export function getAddressCascaderValueFromLowestAddressCode(lowestAddressCode = 'CN') {
  const result = lowestAddressCode.match(addressCodeReg);
  if (result) {
    if (result[4]) {
      return [
        `${result[1]}${result[2]}`,
        `${result[1]}${result[2]}${result[3]}`,
        `${result[1]}${result[2]}${result[3]}${result[4]}`,
      ];
    } else if (result[3]) {
      return [`${result[1]}${result[2]}`, `${result[1]}${result[2]}${result[3]}`];
    } else if (result[2]) {
      return [`${result[1]}${result[2]}`];
    }
  }
  const result2 = lowestAddressCode.match(addressCodeReg2);
  if (result2) {
    const [, d, c, r] = result2;
    const isC = lowestAddressCode.startsWith('C') ? 'C' : '';
    if (r && r !== '00') {
      return [`${d}0000`, `${isC}${d}${c}00`, `${d}${c}${r}`];
    }
    if (c && c !== '00') {
      return [`${d}0000`, `${isC}${d}${c}00`];
    }
    if (d && d !== '00') {
      return [`${d}0000`];
    }
  }
  return [undefined, undefined, undefined];
}

/**
 * @param {any} selectedRows 当前页选中的所有行(Item)
 * @param {any} dataSourceMap 所有选中行(Map: {rowKey: Item})
 * @param {any} rowKey 数据列表行唯一标识(rowKey)
 * @param {any} selectedRowKeys 所有选中行的标识(List: rowKey)
 * @param {any} newSelectedRowKeys 变更后选中数据行的标识(List: rowKey)
 * @returns  更新后所有选中行(Map: {rowKey: Item})
 */
export function getNewDataMap(
  selectedRows,
  dataSourceMap = {},
  rowKey,
  selectedRowKeys,
  newSelectedRowKeys
) {
  let newRowKey = rowKey;
  if (lodash.isString(rowKey)) {
    newRowKey = record => record[rowKey];
  }
  const newDataSourceMap = { ...dataSourceMap };
  if (selectedRowKeys.length < newSelectedRowKeys.length) {
    // 选中操作
    const dif = newSelectedRowKeys.filter(item => selectedRowKeys.indexOf(item) < 0);
    dif.forEach(itemKey => {
      newDataSourceMap[itemKey] = selectedRows.find(item => newRowKey(item) === itemKey);
    });
  } else if (selectedRowKeys.length > newSelectedRowKeys.length) {
    // 取消操作
    const dif = selectedRowKeys.filter(item => newSelectedRowKeys.indexOf(item) < 0);
    dif.forEach(item => {
      delete newDataSourceMap[item];
    });
  }
  return newDataSourceMap;
}

/**
 * 过滤掉对象值为 undefined 和 空字符串 和 空数组 的属性
 * @param obj
 * @returns {*}
 */
export function filterNullValueObject(obj) {
  const result = {};
  if (obj && Object.keys(obj).length >= 1) {
    Object.keys(obj).forEach(key => {
      if (key && obj[key] !== undefined && obj[key] !== '') {
        // 如果查询的条件不为空
        if (lodash.isArray(obj[key]) && obj[key].length === 0) {
          return;
        }
        result[key] = obj[key];
      }
    });
  }
  return result; // 返回查询条件
}

/**
 * 处理请求参数， Moment 对象转换成请求参数
 * @param obj
 * @returns {*}
 */
export function handleQueryMoment(obj, format = handleQueryMoment.format.datetime) {
  return lodash.mapValues(obj, v => {
    if (moment.isMoment(v)) {
      if (format === handleQueryMoment.format.timestamp) {
        return +v;
      }
      return v.format(format);
    }
    return v;
  });
}

handleQueryMoment.format = {};
handleQueryMoment.format.date = 'YYYY-MM-DD';
handleQueryMoment.format.time = 'HH:mm:ss';
handleQueryMoment.format.datetime = 'YYYY-MM-DD HH:mm:ss';
handleQueryMoment.format.timestamp = 'timestamp';
handleQueryMoment.time = {
  min: moment('00:00:00', handleQueryMoment.format.time),
  max: moment('23:59:59', handleQueryMoment.format.time),
  current: moment(),
};
handleQueryMoment.timeStr = {
  min: '00:00:00',
  max: '23:59:59',
  current: () => moment().format(handleQueryMoment.format.datetime),
};

/**
 * 根据下划线拆分请求参数，以两个下划线分隔,把 value 对应的数组分给拆分的key
 * 例如{ "k1__k2__k3": ['v1','v2','v3'] } => { k1: 'v1', k2: 'v2', k3: 'v3' }
 *      { "k1__k2": ['v1','v2','v3'] } => { k1: 'v1', k2: 'v2' }
 *      { "k1__k2_k3": ['v1','v2'] } => { k1: 'v1', k2: 'v2' }
 * @param obj
 * @returns {{}}
 */
export function handleQueryMulti(obj) {
  const result = {};
  if (obj && Object.keys(obj).length >= 1) {
    Object.keys(obj).forEach(key => {
      if (key.indexOf('__') >= 0) {
        const newKeys = key.split('__');
        const values = obj[key];
        // 默认是数组或者空
        if (values) {
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < newKeys.length; i++) {
            if (values[i] === null || values[i] === undefined) {
              break;
            }
            result[newKeys[i]] = values[i];
          }
        }
      } else {
        result[key] = obj[key];
      }
    });
  }
  return result; // 返回查询条件
}
