import { Card, Steps } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import styles from './style.less';

const { Step } = Steps;

class Assignform extends Component {
  getCurrentStep() {
    const { current } = this.props;

    switch (current) {
      case 'info':
        return 0;

      case 'confirm':
        return 1;

      case 'result':
        return 2;

      default:
        return 0;
    }
  }

  render() {
    const currentStep = this.getCurrentStep();
    let stepComponent;

    if (currentStep === 1) {
      stepComponent = <Step2 />;
    } else if (currentStep === 2) {
      stepComponent = <Step3 />;
    } else {
      stepComponent = <Step1 />;
    }

    return (
      <PageHeaderWrapper content="隐患整改">
        <Card bordered={false}>
          <>
            <Steps current={currentStep} className={styles.steps}>
              <Step title="核对隐患信息" />
              <Step title="填写审核结果" />
              <Step title="完成" />
            </Steps>
            {stepComponent}
          </>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ dangerManageAndListTableListAndassignform }) => ({
  current: dangerManageAndListTableListAndassignform.current,
}))(Assignform);
