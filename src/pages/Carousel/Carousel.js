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
  ({ carousel }) => ({
    carousel
  }),
  dispatch =>({
  })
)

//单元格组件
class EditableCell extends React.Component {
  state = {
    imgLoading: false,
    imageUrl: '',
  };
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  handleImgChange = info => {
    if (info.file.status === 'done') {
      this.setState({
        imageUrl: host_v1 + info.file.response,
        // imgLoading: false,
      });
    }
  };
  getInput = (form,dataIndex,record)=> {
      return form.getFieldDecorator(dataIndex, {
        getValueFromEvent: this.normFile,
        initialValue: record.cover_img,
        rules: [{
          required: true,
          message: ` 请上传${this.props.title}!`,
        }],
      })(
        <Upload name="file"
                listType="picture-card"
                showUploadList={false}
                action={UploadURL}
                onChange={this.handleImgChange}
        >
          {this.state.imageUrl ? (
            <img src={this.state.imageUrl} alt="" width="60px" />
          ) : (
            <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
          )}
        </Upload>
        );
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
  ({ carousel }) => ({
    carousel
  }),
  dispatch =>({
    //删除信息
    deleLists(deleOne, callback){
      dispatch({
        type:`carousel/delecarousel`,
        payload:{key: deleOne},
        callback
      })
    },
    //编辑信息
    editList(row, key) {
      //row 要修改的参数 ，可以 record.id
      let params = { row, key };
      dispatch({ type: 'carousel/updatecarousel', payload: params });
    },
    //添加信息
    postProduct(fieldsValue) {
      dispatch({ type: 'carousel/addcarousel', payload: fieldsValue });
    },
  })
)

class Carousel extends React.Component{
  
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
      {title:'id',dataIndex:'id',editable:false,},
      {title:'封面图',dataIndex:'cover_img',editable:true,
       render: cover_img => <img src={host_v1+JSON.parse(cover_img)[0]} alt="img" style={{ width: '34px' }} />,
      },
      {title:'详情图',dataIndex:'content',editable:true,
       render: content => <img src={host_v1+JSON.parse(content)[0]} alt="img" style={{ width: '34px' }} />,
      },
      {title: '操作',dataIndex: 'operation',
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
                          onConfirm={() => this.deleteList(record.id)}
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
                        {/* <Divider type="vertical" />
                        <Button
                          type="primary"
                          onClick={() => this.changeRecommend(record)}
                          // style={{ margin: '5px 5px' }}
                                >
                          {record.commend === 1 ? '已推荐' : '推荐'}
                        </Button> */}
                    </span>
                )}
            </div>     
            );
          },
      },
    ];
  }
  // //推荐
  // changeRecommend = record => {
  //   const { id, commend } = record;
  //   this.props.changeRecommend({ id, commend: commend });
  // };
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
      if (err) return;
      const { cover_img, content } = fieldsValue;
      let img_content = [];
      let img_cover_img=[]
      if (Array.isArray(cover_img)) {
        fieldsValue.cover_img = cover_img[cover_img.length - 1].response.substr(1);
        img_cover_img.push(fieldsValue.cover_img)
        fieldsValue.cover_img=JSON.stringify(img_cover_img)
      }
      if (Array.isArray(content)) {
        content.forEach(itm => {
          img_content.push(itm.response.substr(1));
          fieldsValue.content =JSON.stringify(img_content);
        });
      }
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
  //编辑
  save(form, key) {
    //获取参数
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      // row.class_id=row.cls.class_name
      let { cover_img, content } = row;
      let img_content = [];
      let img_cover_img=[]
      if (Array.isArray(cover_img)) {  
        row.cover_img = cover_img[cover_img.length - 1].response.substr(1);
        img_cover_img.push(row.cover_img )
        row.cover_img=JSON.stringify(img_cover_img);
      }
      if (Array.isArray(content)) {
        content.forEach(itm => {
          img_content.push(itm.response.substr(1));
          row.content =JSON.stringify(img_content);
        });
      }
      const params = row;
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
    const {carousel,form} =this.props
    let {list} =carousel
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
                  {/* cover_img */}
                  <FormItem {...formItemLayout} label='封面图'>
                    {form.getFieldDecorator('cover_img', {
                      getValueFromEvent: this.normFile,
                      rules: [
                        {
                          required: true,
                          message: '请上传封面图',
                        },
                      ],
                    })(
                      <Upload name="file" listType="picture-card" showUploadList={false} action={UploadURL}
                        onChange={this.handleImgChange}
                      >
                      {this.state.imgUrl1 ? (
                        <img src={this.state.imgUrl1} alt="" width="60" />
                      ) : (
                        uploadButton
                      )}
                      </Upload>
                    )}
                  </FormItem>
                  {/* content */}
                  <FormItem {...formItemLayout} label="详细图" extra="按顺序上传">
                    {form.getFieldDecorator('content', {
                      getValueFromEvent: this.normFile,
                      rules: [
                        {
                          required: true,
                          message: '请上传详细图',
                        },
                      ],
                    })(
                      <Upload name="file" showUploadList={true} action={UploadURL} onChange={this.handleImgChange2}
                         multiple={true}
                      >
                        <Button>
                          <Icon type="upload" /> 上传
                        </Button>
                      </Upload>
                    )}
                  </FormItem>
                  {/* class_id */}
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


export default Carousel;