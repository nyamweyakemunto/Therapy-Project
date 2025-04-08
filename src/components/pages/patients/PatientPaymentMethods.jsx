import React, { useState } from 'react';
import SideBar from '../../PatientSideBar';
import { Table, Radio, Input, DatePicker, Button, Card, Divider, Typography } from 'antd';
import { CreditCardOutlined, BankOutlined, HistoryOutlined, InsuranceOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PatientPaymentMethods = () => {
  const [activeTab, setActiveTab] = useState('make-payment');
  const [paymentAmount, setPaymentAmount] = useState('full');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [paymentDate, setPaymentDate] = useState('now');
  const [scheduleDate, setScheduleDate] = useState(null);


  const paymentHistoryData = [
    {
      key: '1',
      date: '05/15/2024',
      amount: '$50.00',
      method: 'Visa ****4242',
      status: 'Completed',
    },
    {
      key: '2',
      date: '04/01/2024',
      amount: '$75.00',
      method: 'ACH',
      status: 'Completed',
    },
  ];

  const paymentPlanDetails = [
    { label: 'Total Balance', value: '$500.00' },
    { label: 'Monthly Payment', value: '$125.00' },
    { label: 'Next Payment Due', value: '06/15/2024' },
    { label: 'Remaining Payments', value: '3' },
  ];

  const insuranceDetails = [
    { label: 'Provider', value: 'Blue Cross Blue Shield' },
    { label: 'Member ID', value: 'XD123456789' },
    { label: 'Last Claim Processed', value: '05/20/2024' },
  ];

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <span style={{ color: '#00d97e' }}>{text}</span>,
    },
    {
      title: 'Receipt',
      key: 'receipt',
      render: () => <a>View</a>,
    },
  ];

  return (
    <SideBar>
      <div className="patient-payment-container">
        <Title level={2} className="welcome-title">Payment Portal</Title>
        <Text type="secondary">View your balance, make payments, and manage your account</Text>

        <Card className="balance-summary-card">
          <div className="balance-summary-grid">
            <div className="balance-item">
              <Text type="secondary">Total Due</Text>
              <Title level={3}>$125.00</Title>
            </div>
            <div className="balance-item">
              <Text type="secondary">Due Date</Text>
              <Title level={3}>06/15/2024</Title>
            </div>
            <div className="balance-item">
              <Text type="secondary">Last Payment</Text>
              <Title level={3}>$50.00</Title>
            </div>
          </div>
        </Card>

        <div className="payment-tabs">
          <Button
            type={activeTab === 'make-payment' ? 'primary' : 'default'}
            icon={<CreditCardOutlined />}
            onClick={() => setActiveTab('make-payment')}
          >
            Make Payment
          </Button>
          <Button
            type={activeTab === 'payment-history' ? 'primary' : 'default'}
            icon={<HistoryOutlined />}
            onClick={() => setActiveTab('payment-history')}
          >
            Payment History
          </Button>
          <Button
            type={activeTab === 'payment-plan' ? 'primary' : 'default'}
            icon={<BankOutlined />}
            onClick={() => setActiveTab('payment-plan')}
          >
            Payment Plan
          </Button>
          <Button
            type={activeTab === 'insurance' ? 'primary' : 'default'}
            icon={<InsuranceOutlined />}
            onClick={() => setActiveTab('insurance')}
          >
            Insurance
          </Button>
        </div>

        {activeTab === 'make-payment' && (
          <Card className="payment-card">
            <Title level={4} className="section-title">Payment Information</Title>
            
            <div className="payment-section">
              <Text strong>Payment Amount:</Text>
              <Radio.Group 
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                style={{ marginTop: 8 }}
              >
                <Radio value="full">Pay full balance ($125.00)</Radio>
                <Radio value="partial">
                  Pay partial amount: 
                  <Input 
                    type="number" 
                    style={{ width: 100, marginLeft: 8 }} 
                    disabled={paymentAmount !== 'partial'}
                  />
                </Radio>
              </Radio.Group>
            </div>

            <Divider />

            <div className="payment-section">
              <Text strong>Payment Method:</Text>
              <Radio.Group 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ marginTop: 8 }}
              >
                <Radio value="credit-card">Credit/Debit Card</Radio>
                {paymentMethod === 'credit-card' && (
                  <div className="payment-method-details">
                    <Input placeholder="Card Number" style={{ marginTop: 8 }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <Input placeholder="MM/YY" />
                      <Input placeholder="CVV" />
                    </div>
                    <Input placeholder="Cardholder Name" style={{ marginTop: 8 }} />
                  </div>
                )}
                
                <Radio value="bank-account">Bank Account (ACH)</Radio>
                {paymentMethod === 'bank-account' && (
                  <div className="payment-method-details">
                    <Input placeholder="Routing Number" style={{ marginTop: 8 }} />
                    <Input placeholder="Account Number" style={{ marginTop: 8 }} />
                    <Radio.Group style={{ marginTop: 8 }}>
                      <Radio value="checking">Checking</Radio>
                      <Radio value="savings">Savings</Radio>
                    </Radio.Group>
                  </div>
                )}
                
                <Radio value="saved">Saved Payment Method (ending in ****4242)</Radio>
              </Radio.Group>
            </div>

            <Divider />

            <div className="payment-section">
              <Text strong>Payment Date:</Text>
              <Radio.Group 
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                style={{ marginTop: 8 }}
              >
                <Radio value="now">Pay now</Radio>
                <Radio value="schedule">
                  Schedule for later date: 
                  <DatePicker 
                    style={{ width: 150, marginLeft: 8 }} 
                    disabled={paymentDate !== 'schedule'}
                    onChange={(date) => setScheduleDate(date)}
                  />
                </Radio>
              </Radio.Group>
            </div>

            <Button type="primary" size="large" style={{ marginTop: 24 }}>
              Submit Payment
            </Button>
          </Card>
        )}

        {activeTab === 'payment-history' && (
          <Card className="history-card">
            <Title level={4} className="section-title">Payment History</Title>
            <Table 
              columns={columns} 
              dataSource={paymentHistoryData} 
              pagination={false}
            />
          </Card>
        )}

        {activeTab === 'payment-plan' && (
          <Card className="plan-card">
            <Title level={4} className="section-title">Payment Plan</Title>
            <div className="plan-details">
              {paymentPlanDetails.map((item, index) => (
                <div key={index} className="plan-item">
                  <Text type="secondary" style={{ width: 150 }}>{item.label}:</Text>
                  <Text strong>{item.value}</Text>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Button style={{ marginRight: 8 }}>Modify Payment Plan</Button>
              <Button type="primary">Make Early Payment</Button>
            </div>
          </Card>
        )}

        {activeTab === 'insurance' && (
          <Card className="insurance-card">
            <Title level={4} className="section-title">Insurance Information</Title>
            <Title level={5} style={{ marginTop: 16 }}>Primary Insurance</Title>
            <div className="insurance-details">
              {insuranceDetails.map((item, index) => (
                <div key={index} className="insurance-item">
                  <Text type="secondary" style={{ width: 150 }}>{item.label}:</Text>
                  <Text strong>{item.value}</Text>
                </div>
              ))}
            </div>
            <Button type="primary" style={{ marginTop: 24 }}>
              Update Insurance Information
            </Button>
          </Card>
        )}

        <Card className="help-card" style={{ marginTop: 24 }}>
          <Title level={4} className="section-title">Need Help?</Title>
          <div className="help-items">
            <Text strong>Billing Questions:</Text> (555) 123-4567 or billing@example.com<br />
            <Text strong>Payment Assistance:</Text> <a>Apply for financial aid</a><br />
            <Text strong>FAQ:</Text> <a>Visit our help center</a>
          </div>
        </Card>

        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 24 }}>
          All payments are processed through our secure, encrypted payment system. We never store your full credit card information.
        </Text>
      </div>

      <style jsx>{`
        .patient-payment-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .welcome-title {
          margin-bottom: 8px;
        }
        
        .balance-summary-card {
          margin: 24px 0;
        }
        
        .balance-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .balance-item {
          text-align: center;
        }
        
        .payment-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        
        .payment-section {
          margin-bottom: 16px;
        }
        
        .payment-method-details {
          margin-left: 24px;
          margin-top: 8px;
        }
        
        .plan-details, .insurance-details {
          margin-left: 16px;
        }
        
        .plan-item, .insurance-item {
          display: flex;
          margin-bottom: 8px;
        }
        
        .help-items {
          line-height: 2;
        }
        
        @media (max-width: 768px) {
          .patient-payment-container {
            padding: 16px;
          }
          
          .balance-summary-grid {
            grid-template-columns: 1fr;
          }
          
          .balance-item {
            text-align: left;
          }
        }
      `}</style>
    </SideBar>
  );
};

export default PatientPaymentMethods;