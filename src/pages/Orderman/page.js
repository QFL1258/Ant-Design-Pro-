import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Table, Input, Popconfirm,Form,Button,Divider,Card,
  Select,Modal,Row,Col,Upload,Icon,InputNumber,message
} from 'antd';
import { host_v1, UploadURL} from '../../constants';



const FormItem = Form.Item;
const EditableContext = React.createContext();

//table 行
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
const EditableFormRow = Form.create()(EditableRow);

@connect(
  ({ product }) => ({
    product
  }),
  dispatch =>({
  })
)

//单元格组件
class EditableCell extends React.Component {

  getInput = (form,dataIndex,record)=> {
  
    }
  render() {
    const {editing,dataIndex,title,inputType,record,index,...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {this.getInput(form,dataIndex,record)}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}


@Form.create()
 //把state和view建立链接
 @connect(
  ({ orderman }) => ({
    orderman
  }),
  dispatch =>({
     //发货状态
    changeRecommend(data) {
      dispatch({ type: 'orderman/condition', payload: data });
    },
  
  })
)

class Orderman extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = { 
      editingKey: '' ,
      //模态框用到的显示影藏
      visible:false,
      selectedRows: [],
      fileList: [],

    };
    this.columns = [
      {
        title:'商品Id',
        dataIndex:'orderProdArr[0].id',
        editable:true,
      },
      {
          title:'商品名',
          dataIndex:'orderProdArr[0].title',
          editable:true,
      },
      {
          title:'数量',
          dataIndex:'orderProdArr[0].counts',
          editable:false,
      },
      {
        title:'地址Id',
        dataIndex:'address.id',
        editable:false,
      },
      {
          title:'订单号',
          dataIndex:'number',
          editable:true,
      },
      {
          title:'发布日期',
          dataIndex:'create_at',
          editable:true,
      },
      {
          title:'地址',
          dataIndex:'address.details',
          editable:true,
      },
      {
          title:'手机号',
          dataIndex:'address.phone',
          editable:true,
      },
      {
        title: '是否付款',
        render: record => <span>{record.status ? '已付款' : '未付款'}</span>,
      },
      {
        title: '是否发货',
        render: record => <span>{record.is_send? '已发货' : '未发货'}</span>,
      },
      {
          title: '操作',
          render: record => (
            <div>
              {record.is_send === 1 ? (
                <Button disabled>已发货</Button>
              ) : (
                <Button type="primary" ghost onClick={() => this.changeRecommend(record)}>
                  发货
                </Button>
              )}
            </div>
          ),
      },
    ];
  }
  //发货状态
  changeRecommend = record => {
    const { order_id,is_send} = record;
    this.props.changeRecommend({ order_id,is_send:is_send});
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };


  //isEditing = this.state.editingKey=record.id
  isEditing = record => record.id === this.state.editingKey;
  //点击编辑按钮后 对state里的editingKey 进行修改 editingKey=record.id
  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const {orderman,form} =this.props
    let {list} =orderman

    //为这个里面每个都加个key值
    list =  list.map(item=>({...item, key: item.order_id}))
    //覆盖默认的 table 元素
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    //遍历列
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        //设置单元格属性
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    //点击按钮后输入框的布局
    const formItemLayout = {
      //label 标签布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      //需要为输入控件设置布局样式时
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>               
          <EditableContext.Provider value={this.props.form}>
            <Table
              scroll={{x:1300}}
              components={components}
              dataSource={list}
              columns={columns}
              rowClassName="editable-row"
              pagination={{
                onChange: this.cancel,
              }}
            />
          </EditableContext.Provider>
        </Card>
      </PageHeaderWrapper>
    );
  }
}


export default Orderman;