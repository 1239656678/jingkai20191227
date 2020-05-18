import React, { Component } from 'react';
import { Modal } from 'antd';
class WebModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title, //标题
      visible, //是否显示
      footerShow, //是否显示自带footer
      titleShow, //是否显示自带title
      onConfirm, //点击确认
      onCancel, //点击取消
      width,
      contentStyle,
      destroyOnClose,
      maskClosable, //是否点击蒙层关闭Modal
    } = this.props;

    return (
      <div
        onKeyDown={e => {
          let ev = typeof event != 'undefined' ? window.event : e;
          if (ev.keyCode == 13) {
            console.log('enter1111');
            return false;
          }
        }}
      >
        <Modal
          width={width ? width : 400}
          title={titleShow ? titleShow : null}
          footer={footerShow}
          onOk={onConfirm}
          onCancel={onCancel}
          visible={visible}
          closable={false}
          destroyOnClose={true}
          maskClosable={maskClosable}
        >
          <div>{title}</div>
          <div style={contentStyle ? contentStyle : null}>{this.props.children}</div>
        </Modal>
      </div>
    );
  }
}

export default WebModal;
