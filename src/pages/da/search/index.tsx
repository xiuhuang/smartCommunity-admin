import React, { Component } from 'react';
import {
  Input,
  Button,
  // Row,
  // Col,
  // Spin,
  Icon,
  message,
} from 'antd';
// import Link from 'umi/link';
import Router from 'umi/router';
import { Dispatch } from 'redux';
// import { connect } from 'dva';
import { StateType } from './model';
import styles from './styles.less';

interface SearchProps {
  dispatch: Dispatch;
  loading: boolean;
  daSearch: StateType;
}

/* eslint react/no-multi-comp:0 */
// @connect(
//   ({
//     daSearch,
//     loading,
//   }: {
//     daSearch: StateType;
//     loading: {
//       models: {
//         [key: string]: boolean;
//       };
//     };
//   }) => ({
//     daSearch,
//     loading: loading.models.daSearch,
//   }),
// )
class Search extends Component<SearchProps> {
  state = {
    searchText: '',
  };

  // componentDidMount() {
  //   this.getHistory();
  // }

  // getHistory = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'daSearch/fetchHistroy',
  //   });
  // };

  onChangeSearch = (e: any) => {
    this.setState({
      searchText: e.target.value,
    });
  };

  search = () => {
    const { searchText } = this.state;
    if (searchText) {
      Router.push(`/da/search/${searchText}`);
    } else {
      message.info('请输入你要搜索的内容');
    }
  };

  render() {
    const { searchText } = this.state;
    // const {
    //   // daSearch: { historyList },
    //   // loading,
    // } = this.props;

    return (
      <div className={styles.searchCon}>
        <h1>智慧搜索</h1>
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
        {/* <div className={styles.historyList}>
          <h4>历史搜索</h4>
          <Spin spinning={loading}>
            <Row className={styles.historyCon}>
              {historyList.map((item: any) => (
                <Col span={8} className={styles.itemBox} key={item.id}>
                  <div className={styles.itemImg}>
                    <Link to="/">
                      <img
                        src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2619296964,386007101&fm=173&app=25&f=JPEG?w=218&h=146&s=7091179948513ADA88A0548F0300E0C0"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className={styles.itemCon}>
                    <p>姓名：{item.name}</p>
                    <p>住宅：{item.content}</p>
                    <p>联系方式：{item.id}</p>
                  </div>
                </Col>
              ))}
              {historyList.length === 0 && <div className={styles.noSearch}>暂无搜索历史</div>}
            </Row>
          </Spin>
        </div> */}
      </div>
    );
  }
}

export default Search;
