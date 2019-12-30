import React, { Component } from 'react';
import { Input, Button, Row, Col, Icon, message, Pagination, Spin } from 'antd';
// import Link from 'umi/link';
import Router from 'umi/router';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from './model';
// import { getCommunityId } from '@/utils/token';
import FacilityInfoModal from './components/facilityInfoModal';
import styles from './styles.less';

interface SearchProps {
  dispatch: Dispatch;
  loading: boolean;
  daSearch: StateType;
  match: any;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    daSearch,
    loading,
  }: {
    daSearch: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    daSearch,
    loading: loading.models.daSearch,
  }),
)
class Search extends Component<SearchProps> {
  state = {
    searchText: '',
    deviceVisible: false,
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  facilityId = '';

  componentDidMount() {
    this.getSearchText();
  }

  handleDeviceVisible = (flag?: boolean) => {
    this.setState({
      deviceVisible: !!flag,
    });
  };

  getSearchText = () => {
    const { match } = this.props;
    this.setState(
      {
        searchText: match.params.searchText,
      },
      this.getData,
    );
  };

  getData = () => {
    const { searchText } = this.state;
    const { dispatch } = this.props;
    const { pagination } = this;
    dispatch({
      type: 'daSearch/fetch',
      payload: {
        // communityId: getCommunityId(),
        keyword: searchText,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  onChangeSearch = (e: any) => {
    this.setState({
      searchText: e.target.value,
    });
  };

  search = () => {
    const { searchText } = this.state;
    if (searchText) {
      this.pagination.current = 1;
      this.getData();
    } else {
      message.info('请输入你要搜索的内容');
    }
  };

  paginChange = (page: number) => {
    this.pagination.current = page;
    this.getData();
  };

  onShowSizeChange = (current: any, size: any) => {
    this.pagination.pageSize = size;
    this.getData();
  };

  goDetail = (item: any) => {
    if (item.docType === 'resident') {
      Router.push(`/da/residentFile/detail?residentId=${item.residentId}`);
      return;
    }
    if (item.docType === 'car') {
      if (item.ownType === '0') {
        Router.push(`/da/residentFile/carDetail?carId=${item.carId}&residentId=${item.residentId}`);
        return;
      }
      Router.push(`/da/institution/carDetail?carId=${item.carId}`);
      return;
    }
    // if (item.ownType === '1') {
    //   Router.push(`/da/residentFile/detail?residentId=${item.residentId}`);
    //   return;
    // }
    this.facilityId = item.deviceId;
    this.handleDeviceVisible(true);
  };

  render() {
    const { searchText, deviceVisible } = this.state;
    const {
      daSearch: { data },
      loading,
    } = this.props;
    const { current } = this.pagination;

    const FacilityInfoModalProps = {
      facilityId: this.facilityId,
      visible: deviceVisible,
      handleVisible: this.handleDeviceVisible,
    };
    return (
      <div>
        <div className={`${styles.searchCon} ${styles.searchDetailCon}`}>
          <div className={styles.searchBox}>
            <Input
              placeholder="请输入你要搜索的内容"
              prefix={<Icon type="search" />}
              value={searchText}
              onChange={this.onChangeSearch}
              onPressEnter={this.search}
            />
            <Button onClick={this.search}>搜一搜</Button>
          </div>
          <div className={styles.historyList}>
            <h4>搜索结果: {data.total}条</h4>
            {data.data.length > 0 && (
              <div>
                <Spin spinning={loading}>
                  <Row className={styles.historyCon}>
                    {data.data.map((item: any) => (
                      <Col
                        span={8}
                        className={styles.itemBox}
                        key={`${item.residentId || ''}${item.houseId || ''}${item.deviceId || ''}`}
                        onClick={() => this.goDetail(item)}
                      >
                        <div className={styles.itemImg}>
                          {/* <Link to="/"> */}
                          <img
                            src={item.residentPicUrl ? item.residentPicUrl : '/default.png'}
                            alt=""
                          />
                          {/* </Link> */}
                        </div>
                        <div className={styles.itemCon}>
                          {item.residentName && <p>姓名：{item.residentName}</p>}
                          {item.houseName && <p>住宅：{item.houseName}</p>}
                          {item.carNo && <p>车牌：{item.carNo}</p>}
                          {item.carOwner && <p>车主：{item.carOwner}</p>}
                          {item.deviceName && <p>楼号：{item.deviceName}</p>}
                          {item.deviceManager && <p>物业管理员：{item.deviceManager}</p>}
                          {item.contactPhone && <p>联系方式：{item.contactPhone}</p>}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Spin>
                <div className={`${styles.paginationBox} ghPagination`}>
                  <Pagination
                    size="small"
                    total={data.total}
                    current={current}
                    showSizeChanger
                    showQuickJumper
                    onChange={this.paginChange}
                    onShowSizeChange={this.onShowSizeChange}
                  />
                </div>
              </div>
            )}
            {data.data.length === 0 && <div className={styles.noSearch}>未搜索到数据</div>}
          </div>
        </div>
        <FacilityInfoModal {...FacilityInfoModalProps} />
      </div>
    );
  }
}

export default Search;
