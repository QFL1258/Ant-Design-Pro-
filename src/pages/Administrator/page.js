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
  ({ administrator }) => ({
    administrator
  }),
  dispatch =>({
  })
)

//单元格组件
class EditableCell extends React.Component {
  // state = {
  //   imgLoading: false,
  //   imageUrl: '',
  // };
  // normFile = e => {
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };
  // handleImgChange = info => {
  //   if (info.file.status === 'done') {
  //     this.setState({
  //       imageUrl: host_v1 + info.file.response,
  //       imgLoading: false,
  //     });
  //   }
  // };
  getInput = (form,dataIndex,record)=> {//input
         return form.getFieldDecorator(dataIndex,{
          rules: [{
            required: true,
            message: `Please Input ${this.props.title}!`,
          }],
          initialValue: record[dataIndex],
        })(<Input />);
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
  ({ administrator }) => ({
    administrator
  }),
  dispatch =>({
    //删除
    deleAdmin(deleOne, callback){
      dispatch({
        type:`administrator/deleAdmin`,
        payload:{key: deleOne},
        callback
      })
    },
    //编辑
    compile(row, key) {
      //row 要修改的参数 ，可以 record.id
      let params = { row, key };  
      dispatch({ type: 'administrator/compile', payload: params });
    },
    //添加
    postAdmin(fieldsValue) {
      dispatch({ type: 'administrator/postAdmin', payload: fieldsValue });
    },
    //设置
    setSuper(data) {
      dispatch({ type: 'administrator/setSuper', payload: data });
    },
  })
)

class Administrator extends React.Component{
  
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
          editable:false,
      },
      {
          title:'账号',
          dataIndex:'account',
          editable:true,
      },
      {
          title:'密码',
          dataIndex:'pwd',
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
                        <Button onClick={() => this.edit(record.id)} size="small">
                          编辑
                        </Button>
                        <Divider type="vertical" />
                        <Popconfirm
                          title="将删除该人员及其任何相关信息"
                          okText="删除"
                          cancelText="取消"
                          onConfirm={() => this.deleAdmin(record.id)}
                          >
                            <Button type="danger" size="small">
                              删除
                            </Button>
                        </Popconfirm>
                         {/* <Button
                                type="primary"
                                onClick={() => this.changeShift(record)}
                                style={{ margin: '8px 8px' }}
                            >
                              {record.shelf === 1 ? '已下架' : '已上架'}
                        </Button> */}
                        <Divider type="vertical" />
                        <Button
                          type="primary"
                          onClick={() => this.changeRecommend(record)}
                          // style={{ margin: '5px 5px' }}
                                >
                          {record.is_super === 1 ? '设置超级管理员' : '取消超级管理员'}
                        </Button>
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
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  // //上架  下架
  // changeShift = record => {
  //   let { id, shelf } = record;
  //   this.props.changeShift({ id, num: shelf });
  // };
  //设置超级管理员
  changeRecommend = record => {
    const { id, is_super } = record;
    this.props.setSuper({ id, is_super: is_super });
  };
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
      if (err) return;
      // const { cover_img, content } = fieldsValue;
      // let img_content = [];
      // let img_cover_img=[]
      // if (Array.isArray(cover_img)) {
      //   fieldsValue.cover_img = cover_img[cover_img.length - 1].response.substr(1);
      //   img_cover_img.push(fieldsValue.cover_img)
      // }
      // if (Array.isArray(content)) {
      //   content.forEach(itm => {
      //     img_content.push(itm.response.substr(1));
      //   });
      // }
      // fieldsValue.content =JSON.stringify(img_content);
      // fieldsValue.cover_img=JSON.stringify(img_cover_img);
        this.props.postAdmin(fieldsValue);
        this.setState({visible: false,});
    });
  }
  //删除
  deleAdmin = key =>{
    let deleOne = [];
    deleOne.push(key);
    const callback = () => {
      this.setState({
        selectedRows: [],
      });
    };
    this.props.deleAdmin(deleOne, callback);
  }
  //编辑
  save(form, key) {
    //获取参数
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      // row.class_id=row.cls.class_name
      // let { cover_img, content } = row;
      // let img_content = [];
      // let img_cover_img=[]
      // if (Array.isArray(cover_img)) {  
      //   row.cover_img = cover_img[cover_img.length - 1].response.substr(1);
      //   img_cover_img.push(row.cover_img )
      // }
      // if (Array.isArray(content)) {
      //   content.forEach(itm => {
      //     img_content.push(itm.response.substr(1));
      //   });
      // }
      // row.content =JSON.stringify(img_content);
      // row.cover_img=JSON.stringify(img_cover_img);
      const params = row;
      this.props.compile(params, key * 1);
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
    const {administrator,form} =this.props
    let {list} =administrator

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
          inputType:col.dataIndex === 'cover_img' || col.dataIndex === 'content' ? 'image' : 'text',
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
          <Button icon="plus" 
                    type="primary"
                    style={{ marginBottom: '20px' }}
                    onClick={() => this.showModal()}
            > 添加
          </Button>
            <Modal
                title="添加商品"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form>
                  {/* 账户 */}
                  <FormItem {...formItemLayout} label="账号">
                    {form.getFieldDecorator('account', {
                      rules: [
                        {
                          required: true,
                          message: '请输入账户',
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                  {/* 密码 */}
                  <FormItem {...formItemLayout} label="密码">
                    {form.getFieldDecorator('pwd', {
                      rules: [
                        {
                          required: true,
                          message: '请输入密码',
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                  {/* id*/}
                  {/* <FormItem {...formItemLayout} label="id">
                    {form.getFieldDecorator('class_id', {
                      rules: [
                        {
                          required: true,
                          message: '请输入id',
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </FormItem> */}
                </Form>
            </Modal>
          <EditableContext.Provider value={this.props.form}>
            <Table
              // scroll={{x:1300}}
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


export default Administrator;
