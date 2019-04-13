import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { host_v1, UploadURL } from '../../constants';
import {
    Table, Input, Popconfirm,Form,Button,Divider,Card,
    Select,Modal,Row,Col,Upload,Icon
  } from 'antd';
  
  const PERSONAL = 'personal';

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
  ({ personal }) => ({
  personal
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
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  //图片上传的处理方法
  handleImgChange = info => {
    //info 这个变量里包含了好多东西 
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.setState({
        // imageUrl: host_v1 + info.file.response.files[0].thumbnailUrl,
        imageUrl: host_v1 + info.file.response,
        // imgUrl2: info.file.name,
        imgLoading: false,
      });
    }
  };
  getInput = (form,dataIndex,record)=> {
    let { selectlist } = this.props.personal;
    //图片编辑
    if(this.props.title==='分类图片'){
      return form.getFieldDecorator(dataIndex,{
        //可以把 onChange 的参数（如 event）转化为控件的值
        getValueFromEvent: this.normFile,
        //子节点的初始值，类型、可选值均由子节点决定(注意：由于内部校验时使用 === 判断是否变化，建议使用变量缓存所需设置的值而非直接使用字面量))
        initialValue: record[dataIndex],
      })(
        <Upload name="file" listType="picture-card" showUploadList={false} action={UploadURL}
            onChange={this.handleImgChange}
        >
          {this.state.imageUrl ? (
            <img src={this.state.imageUrl} alt="" width="60px" />
          ) : (
            <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
          )}
        </Upload>
      )

    }else if(this.props.title==='分类'){//下拉选择框
      return form.getFieldDecorator(dataIndex, {
        //子节点的值的属性，如 Switch 的是 'checked' 参数是'value'
        valuePropName: 'fileList',
        getValueFromEvent: this.normFile,
        initialValue: record.id,
      })(
        <Select
          style={{ width: 120 }}
          placeholder={record.name}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase())>= 0
          }
        >
          {selectlist.map(item => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      );
    }else {
      return form.getFieldDecorator(dataIndex,{
        //子节点的初始值，类型、可选值均由子节点决定(注意：由于内部校验时使用 === 判断是否变化，建议使用变量缓存所需设置的值而非直接使用字面量))
        rules: [{
          required: true,
          message: `Please Input ${this.props.title}!`,
        }],
        initialValue: record[dataIndex],
      })(<Input />);
    }
  };

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
    ({ personal }) => ({
    personal
    }),
    dispatch =>({
      //删除
      deleLists(deleOne, callback){
        dispatch({
          type:`${PERSONAL}/deletepersonal`,
          payload:{key: deleOne},
          callback
        })
      },
      //发送action 去逻辑 进行保存
      editList(row, key) {
        //row 要修改的参数 ，可以 record.id
        let params = { row, key };
        dispatch({ type: `${PERSONAL}/savepersonal`, payload: params });
      },
    })
)

class Personalitem extends React.Component {
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
          title:'新闻ID',
          dataIndex:'id',
          editable:false,
      },
      {
          title:'分类',
          dataIndex:'classify',
          editable:true,
      },
      {
          title:'分类图片',
          dataIndex:'img',
          editable:true,
          render: img => <img src={img} alt="img" style={{ width: '34px' }} />,
      },
      {
          title: '题目',
          dataIndex: 'title',
          editable: true,
      },
      {
          title: '简介',
          dataIndex: 'intro',
          editable: true,
      },
      {
          title: '类型',
          dataIndex: 'mold',
          editable: false,
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
                        <Button onClick={() => this.edit(record.id)} size="small">
                          置顶
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

  //点击模态框确定的回调
  handleOk = (e) => {
    const {form} =this.props;
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      const { title} = fieldsValue;
      console.log(title);
      // if (isEmail(email)) {
      //   this.props.submitAccount({ name: account, email, bu_id });
        this.setState({
        visible: false,
        });
      //   form.resetFields();
      // } else {
      //   message.error('邮箱格式错误');
      // }
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
    //经 Form.create() 包装过的组件会自带 this.props.form 属性 Form.create(options)
    //校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
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
    const {personal,form} =this.props
    const {list} =personal
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
                title="Basic Modal"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <Form>
                  <FormItem {...formItemLayout} label="名称">
                    {form.getFieldDecorator('title', { //getFieldDecorator(id, options) 参数
                      //校验规则
                      rules: [
                        {
                          //是否必填
                          required: true,
                          //校验文案
                          message: 'Please input  name',
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Form>
            </Modal>
          <EditableContext.Provider value={this.props.form}>
            <Table
              components={components}
              rowKey="id"
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
  


export default Personalitem;