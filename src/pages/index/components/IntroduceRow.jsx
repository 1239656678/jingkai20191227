import { Col, Icon, Row, Tooltip } from 'antd';
import React, { Component, Suspense } from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import styles from '../style.less';
import safy from '../../../imgs/safy.png';
import { connect } from 'dva';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};
const style = {
  background: '#fff',
  padding: '8px 20px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '18px',
  color: '#333333',
  fontWeight: 'bold',
  lineHeight: '25px',
};
const headerStyle = {
  borderTop: '1px solid #EBEBEB',
  background: '#fff',
  padding: '20px 20px 10px',
  fontSize: '16px',
  lineHeight: '22px',
  color: '#666666',
};

class IntroduceRow extends Component {
  state = {
    repairnewCount: '',
    repairCount: '',
    equipmentNewCount: '',
    equipmentCount: '',
    dangerNewCount: '',
    dangerCount: '',
    inspectionNewCount: '',
    inspectionCount: '',
  };
  componentDidMount() {
    this.props
      .dispatch({
        type: 'global/fetchHeadDataList',
      })
      .then(r => {
        this.setState({
          repairnewCount: this.props.fetchHeaderData.payload.data.repair.newCount,
          repairCount: this.props.fetchHeaderData.payload.data.repair.count,
          equipmentNewCount: this.props.fetchHeaderData.payload.data.equipment.newCount,
          equipmentCount: this.props.fetchHeaderData.payload.data.equipment.count,
          dangerNewCount: this.props.fetchHeaderData.payload.data.danger.newCount,
          dangerCount: this.props.fetchHeaderData.payload.data.danger.count,
          inspectionNewCount: this.props.fetchHeaderData.payload.data.inspection.newCount,
          inspectionCount: this.props.fetchHeaderData.payload.data.inspection.count,
        });
      });
  }

  render() {
    return (
      <div>
        <Row gutter={24}>
          <Col className="gutter-row" span={6} {...topColResponsiveProps}>
            <div style={style}>
              <img src={safy} style={{ marginRight: '10px' }} /> 设备量
            </div>
            <div style={headerStyle}>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                总数量
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: 500,
                    color: '#000000',
                    width: '155px',
                    height: '56px',
                    lineHeight: '56px',
                    marginLeft: '20px',
                  }}
                >
                  {this.state.equipmentCount}
                </div>
              </div>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                新增量
                <div style={{ fontSize: '16px', color: '#666666', marginLeft: '27px' }}>
                  {this.state.equipmentNewCount}
                </div>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6} {...topColResponsiveProps}>
            <div style={style}>
              <img src={safy} style={{ marginRight: '10px' }} /> 检查量
            </div>
            <div style={headerStyle}>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                总数量
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: 500,
                    color: '#000000',
                    width: '155px',
                    height: '56px',
                    lineHeight: '56px',
                    marginLeft: '20px',
                  }}
                >
                  {this.state.inspectionCount}
                </div>
              </div>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                新增量
                <div style={{ fontSize: '16px', color: '#666666', marginLeft: '27px' }}>
                  {this.state.inspectionNewCount}
                </div>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6} {...topColResponsiveProps}>
            <div style={style}>
              <img src={safy} style={{ marginRight: '10px' }} /> 隐患量
            </div>
            <div style={headerStyle}>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                总数量
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: 500,
                    color: '#000000',
                    width: '155px',
                    height: '56px',
                    lineHeight: '56px',
                    marginLeft: '20px',
                  }}
                >
                  {this.state.dangerCount}
                </div>
              </div>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                新增量
                <div style={{ fontSize: '16px', color: '#666666', marginLeft: '27px' }}>
                  {this.state.dangerNewCount}
                </div>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6} {...topColResponsiveProps}>
            <div style={style}>
              <img src={safy} style={{ marginRight: '10px' }} /> 整改量
            </div>
            <div style={headerStyle}>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                总数量
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: 500,
                    color: '#000000',
                    width: '155px',
                    height: '56px',
                    lineHeight: '56px',
                    marginLeft: '20px',
                  }}
                >
                  {this.state.repairCount}
                </div>
              </div>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                新增量
                <div style={{ fontSize: '16px', color: '#666666', marginLeft: '27px' }}>
                  {this.state.repairnewCount}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({ global }) => ({
  fetchHeaderData: global.fetchHeaderList,
}))(IntroduceRow);
