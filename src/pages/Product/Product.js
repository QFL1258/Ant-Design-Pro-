import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Table, Input, Popconfirm,Form,Button,Divider,Card,
  Select,Modal,Row,Col,Upload,Icon, message
} from 'antd';

import services from '@/services/api_2.js';

const FormItem = Form.Item;
const EditableContext = React.createContext();

//table 行
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
const EditableFormRow = Form.create()(EditableRow);

// @connect(
//   ({ product }) => ({
//     product
//   }),
//   dispatch =>({
//     query() {
//       dispatch({type: 'getInfo'})
//     }
//   })
// )

//单元格组件
class EditableCell extends React.Component {
  
  getInput = (form,dataIndex,record)=> {
      if(this.props.title==='商品分类'){
        return form.getFieldDecorator(dataIndex,{
          rules: [{
            required: true,
            message: `Please Input ${this.props.title}!`,
          }],
          initialValue: record[dataIndex],
        })(<Input />);
      }
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
  ({ product }) => ({
    product
  }),
  dispatch =>({
     //添加
     addProduct(params) {
      dispatch({ type: 'product/addProduct', payload: params });
    },
    //编辑  保存
    editList(row, key) {
      //row 要修改的参数 ，可以 record.id
      let params = { row, key };
      dispatch({ type: 'product/saveredact', payload: params });
    },
    //删除
    deleLists(deleOne, callback){
      dispatch({
        type:`product/deleteredact`,
        payload:{key: deleOne},
        callback
      })
    },
   
  })
)

class Product extends React.Component{
  constructor(props) {
    super(props);
    this.state = { 
      editingKey: '' ,
      //模态框用到的显示影藏
      visible:false,
      selectedRows: [],
    };
   
    this.columns = [
      {

          title:'商品ID',
          dataIndex:'id',
          editable:false,
      },
      {
          title:'商品分类',
          dataIndex:'name',
          editable:true,
      },
      {
          title: '操作',
          dataIndex: 'operation',
          render: (text, record,index) => {
            //判断是否可以修改
            const editable = this.isEditing(record);
            return (
              <div className="editable-row-operations">
                { editable ? (
                  // 可以修改就显示 修改项 和 保存 取消按钮
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <Button size="small" onClick={() => this.save(form, record.id)}  type="primary" >
                          保存
                        </Button>
                      )}
                    </EditableContext.Consumer>
                    <Divider type="vertical" />
                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                      <Button size="small">取消</Button>
                    </Popconfirm>
                  </span>
                ) : (
                    <span>
                        <Button onClick={() => this.edit(record.id)} size="small">
                          编辑
                        </Button>
                        <Divider type="vertical" />
                        <Popconfirm
                          title="将删除该人员及其任何相关信息"
                          okText="删除"
                          cancelText="取消"
                          onConfirm={() => this.deleteList(record.id)}
                          >
                            <Button type="danger" size="small">
                              删除
                            </Button>
                        </Popconfirm>
                    </span>
                )}
            </div>     
            );
          },
      },
    ];
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  //添加 点击模态框确定的回调 
  handleOk = (e) => {
    const {form} =this.props;
    const {list} =this.props.product
    let listname=[]
     list.filter((item)=>{
     return  listname.push(item.name)
   })
   
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {name} = fieldsValue;
      if(listname.includes(name)){
        return (
          message.info('已经有这个分类了')
        )
      }else{
        this.props.addProduct({ name:name});
        this.setState({
          visible: false,
        });
      }
      
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

  //删除
  deleteList = key =>{
    let deleOne = [];
    deleOne.push(key);
    const callback = () => {
      this.setState({
        selectedRows: [],
      });
    };
    this.props.deleLists(deleOne, callback);
  }
  //保存
  save(form, key) {
    const {list} =this.props.product
      let listname=[]
      list.filter((item)=>{
      return  listname.push(item.name)
    })

    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const {name} =row
      if(listname.includes(name)){
        return (
          message.info('已经有这个分类了,编辑失败')
        )
      }else{
        const params = row;
        this.props.editList(params, key * 1);
        message.info('保存成功')
        this.setState({ editingKey: '' });
      }


    });
      this.setState({ editingKey: '' });
  }

  //isEditing = this.state.editingKey=record.id
  isEditing = record => record.id === this.state.editingKey;
  //点击编辑按钮后 对state里的editingKey 进行修改 editingKey=record.id
  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const {product,form} =this.props
    let {list} =product
    //为这个里面每个都加个key值
    list = list.map(item=>({...item, key: item.id}))
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
          <Button icon="plus" 
                    type="primary"
                    style={{ marginBottom: '20px' }}
                    onClick={() => this.showModal()}
            > 添加
          </Button>
            <Modal
                title="添加分类"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form>
                  <FormItem {...formItemLayout} label="分类">
                    {form.getFieldDecorator('name', { //getFieldDecorator(id, options) 参数
                      //校验规则
                      rules: [
                        {
                          //是否必填
                          required: true,
                          //校验文案
                          message: '请输入分类名',
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Form>
            </Modal>
          <EditableContext.Provider value={this.props.form}>
            <Table
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


export default Product;
