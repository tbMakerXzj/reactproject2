import React, {Component} from 'react'

import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table
} from 'antd'
import LinkButton from "../../components/link-button/link-button";
import {reqProducts, reqSearchProducts} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";

const Option = Select.Option

/*
Product的添加和更新的子路由组件
 */
export default class ProductHome extends Component {
  state = {
    total: 0,  //默认初始数量
    products: [],
    loading: false, //加载中
    searchType: 'productName',//搜索的类型
    searchName: '',  //搜索的名称
  }

  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price  //指定显示的值的样式
      },
      {
        title: '状态',
        width: 100,
        dataIndex: 'status',
        render: (status) => {
          return (
            <span>
              <Button type='primary'>下架</Button>
              <span>在售</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (product) => {
          return (
            <span>
              <LinkButton>详情</LinkButton>
              <LinkButton>修改</LinkButton>
            </span>
          )
        }
      },
    ];
  }

  /**
   * 获取指定页码的列表数据
   */
  getProducts = async (pageNum) => {
    //发请求  中
    this.setState({
      loading: true
    })

    const {searchName, searchType} = this.state

    let result
    //关键字搜索  搜索分页
    if (searchName) {
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    } else {//一般分页
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    //请求结束
    this.setState({
      loading: false
    })
    if (result.status === 0) {
      const {total, list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ];

    const {products, total, loading, searchName, searchType} = this.state


    const title = (
      <span>
        <Select
          value={searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType: value})}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={searchName}
          onChange={e => this.setState({searchName: e.target.value})}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )

    const extra = (
      <Button type='primary'>
        <Icon type='plus'></Icon>
        添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey='_id'
          bordered
          loading={loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.getProducts
          }}
        />;
      </Card>
    )
  }
}
