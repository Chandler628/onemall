import {message} from 'antd';import {
  addBanner,
  deleteBanner,
  queryBanner,
  updateBanner,
  updateBannerStatus,
} from '../../services/promotion';
import PaginationHelper from '../../../helpers/PaginationHelper';

const SEARCH_PARAMS_DEFAULT = {
  title: '',
};

export default {
  namespace: 'bannerList',

  state: {
    // 分页列表相关
    list: [],
    listLoading: false,
    pagination: PaginationHelper.defaultPaginationConfig,
    searchParams: SEARCH_PARAMS_DEFAULT,

    // 添加 or 修改表单相关
    modalVisible: false,
    modalType: undefined, // 'add' or 'update' 表单
    formVals: {}, // 当前表单值
    modalLoading: false,
  },

  effects: {
    // 查询列表
    * query({ payload }, { call, put }) {
      // 显示加载中
      yield put({
        type: 'changeListLoading',
        payload: true,
      });

      // 请求
      const response = yield call(queryBanner, payload);
      // 响应
      yield put({
        type: 'setAll',
        payload: {
          list: response.data.list,
          pagination: PaginationHelper.formatPagination(response.data, payload),
          searchParams: {
            title: payload.title || ''
          }
        },
      });

      // 隐藏加载中
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    * add({ payload }, { call, put }) {
      const { callback, body } = payload;
      // 显示加载中
      yield put({
        type: 'changeModalLoading',
        payload: true,
      });

      // 请求
      const response = yield call(addBanner, body);
      // 响应
      if (response.code === 0) {
        if (callback) {
          callback(response);
        }
        // 刷新列表
        yield put({
          type: 'query',
          payload: {
            ...PaginationHelper.defaultPayload
          },
        });
      }

      // 隐藏加载中
      yield put({
        type: 'changeModalLoading',
        payload: false,
      });
    },
    * update({ payload }, { call, put }) {
      const { callback, body } = payload;
      // 显示加载中
      yield put({
        type: 'changeModalLoading',
        payload: true,
      });

      // 请求
      const response = yield call(updateBanner, body);
      // 响应
      if (response.code === 0) {
        if (callback) {
          callback(response);
        }
        // 刷新列表
        yield put({
          type: 'query',
          payload: {
            ...PaginationHelper.defaultPayload
          },
        });
      }

      // 隐藏加载中
      yield put({
        type: 'changeModalLoading',
        payload: false,
      });
    },

    * updateStatus({ payload }, { call, put }) {
      // 请求
      const response = yield call(updateBannerStatus, payload);
      // 响应
      if (response.code === 0) {
        message.info('更新状态成功!');
        // 刷新列表
        yield put({
          type: 'query',
          payload: {
            ...PaginationHelper.defaultPayload
          },
        });
      }
    },

    * delete({ payload }, { call, put }) {
      // 请求
      const response = yield call(deleteBanner, payload);
      // 响应
      if (response.code === 0) {
        message.info('删除成功!');
        // 刷新列表
        yield put({
          type: 'query',
          payload: {
            ...PaginationHelper.defaultPayload
          },
        });
      }
    },

  },

  reducers: {
    // 修改加载中的状态
    changeModalLoading(state, { payload }) {
      return {
        ...state,
        modalLoading: payload,
      };
    },
    changeListLoading(state, { payload }) {
      return {
        ...state,
        listLoading: payload,
      };
    },
    // 设置所有属性
    setAll(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    }
  },
};
