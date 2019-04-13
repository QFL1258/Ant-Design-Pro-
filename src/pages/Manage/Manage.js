import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Table, Input, Popconfirm,Form,Button,Divider,Card,
  Select,Modal,Row,Col,Upload,Icon,InputNumber
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
  ({ management }) => ({
    management
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
  ({ management }) => ({
    management
  }),
  dispatch =>({
    //删除商品
    deleLists(deleOne, callback){
      dispatch({
        type:`management/deleteitem`,
        payload:{key: deleOne},
        callback
      })
    },

  })
)

class Manage extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = { 
      editingKey: '' ,
      //模态框用到的显示影藏
      visible:false,
      selectedRows: [],
      fileList: [],
      imgUrl1: '',
      imgUrl2: '',
    };
    this.columns = [
      {
          title:'id',
          dataIndex:'id',
          editable:true,
      },
      {
          title:'手机号',
          dataIndex:'phone',
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
                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
                      <Button size="small">取消</Button>
                    </Popconfirm>
                  </span>
                ) : (
                    <span>
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

  //图片上传
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  //封面图
  handleImgChange = info => {
    if (info.file.status === 'done') {
      this.setState({
        imgUrl1: host_v1 + info.file.response,
      });
    }
  };
  //详情图
  handleImgChange2 = info => {
    if (info.file.status === 'done') {
      this.setState({
        imgUrl2: host_v1 + info.file.response,
      });
    }
  };
  //添加 点击模态框确定的回调 
  handleOk = (e) => {
    const {form} =this.props;
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      const { cover_img, content } = fieldsValue;
      let img_content = [];
      let img_cover_img=[]
      if (Array.isArray(cover_img)) {
        fieldsValue.cover_img = cover_img[cover_img.length - 1].response.substr(1);
        img_cover_img.push( fieldsValue.cover_img)
      }
      if (Array.isArray(content)) {
        content.forEach(itm => {
          img_content.push(itm.response.substr(1));
        });
      }
      fieldsValue.content =JSON.stringify(img_content);
      fieldsValue.cover_img=JSON.stringify(img_cover_img);
        this.props.postProduct(fieldsValue);
        this.setState({visible: false,});
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
    //获取参数
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const params = row;
      //继承dispath中的 action 发送dispatch 通过action发送一个到后台
      this.props.editList(params, key * 1);
      this.setState({ editingKey: '' });
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
    const {management,form} =this.props
    let {list} =management
    //为这个里面每个都加个key值
    list =  list.map(item=>({...item, key: item.id}))
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
    //上传按钮
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );



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


export default Manage;